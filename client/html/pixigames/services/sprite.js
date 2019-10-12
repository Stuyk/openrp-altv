class BaseSprite {
    constructor(texture, useGravity = false) {
        this.container = new PIXI.Container();
        const sprite = new PIXI.Sprite(
            PIXI.loader.resources[`assets/${texture}.png`].texture
        );
        this.container.addChild(sprite);
        this.container.sprite = sprite;
        this.container.pivot.x = this.container.width / 2;
        this.container.pivot.y = this.container.height / 2;
        this.container.rotation = 0;
        this.container.vx = 0;
        this.container.vy = 0;
        this.container.velocityClamp = 2;
        this.floor = false;
        this.useGravity = useGravity;
    }

    load() {
        Game.stage.addChild(this.container);
    }

    unload() {
        Game.stage.removeChild(this.container);
    }

    resetVelocity() {
        this.container.vx = 0;
        this.container.vy = 0;
        this.floor = false;
    }

    gravity(delta) {
        if (!this.useGravity) return;
        if (this.moving) return;

        if (this.container.vx !== 0 || this.container.vy !== 0) {
            this.container.x += this.container.vx;
            this.container.y += this.container.vy;

            if (this.container.vx > this.container.velocityClamp) {
                this.container.vx = this.container.velocityClamp;
            }

            if (this.container.vy >= this.container.velocityClamp) {
                this.container.vy = this.container.velocityClamp;
            }

            if (this.container.vx < -this.container.velocityClamp) {
                this.container.vx = -this.container.velocityClamp;
            }

            if (this.container.vy < -this.container.velocityClamp) {
                this.container.vy = -this.container.velocityClamp;
            }
        }

        if (this.rotateClockwise) {
            this.container.rotation += 0.01;
        }

        if (!this.floor) {
            this.container.vy += 0.03;
            this.container.y += this.container.vy;
            if (this.container.y + this.container.height / 2 >= Game.renderer.height) {
                if (!this.ignoreGameBounds) {
                    this.floor = true;
                    this.container.vy = 0;
                }
            }
        }
    }

    checkGameBounds() {
        if (this.container.x + this.container.width / 2 > Game.renderer.width) {
            if (!this.ignoreGameBounds) {
                this.container.x = Game.renderer.width - this.container.width / 2;
                this.container.vx = 0;
            } else {
                emitEvent(eventNames.ON_LEFT_GAME_BOUNDS, this, 'right');
            }
        }

        if (this.container.y + this.container.height / 2 > Game.renderer.height) {
            if (!this.ignoreGameBounds) {
                this.container.y = Game.renderer.height - this.container.height / 2;
                this.container.vy = 0;
            } else {
                emitEvent(eventNames.ON_LEFT_GAME_BOUNDS, this, 'bottom');
            }
        }

        if (this.container.y - this.container.height / 2 < 0) {
            if (!this.ignoreGameBounds) {
                this.container.y = this.container.height / 2;
                this.container.vy = 0;
            } else {
                emitEvent(eventNames.ON_LEFT_GAME_BOUNDS, this, 'top');
            }
        }

        if (this.container.x - this.container.width / 2 < 0) {
            if (!this.ignoreGameBounds) {
                this.container.x = this.container.width / 2;
                this.container.vx = 0;
            } else {
                emitEvent(eventNames.ON_LEFT_GAME_BOUNDS, this, 'left');
            }
        }
    }
}

class Clickable extends BaseSprite {
    constructor(texture, useGravity, lockPosition = false) {
        super(texture, useGravity);
        this.moveBind = this.move.bind(this);
        this.mouseUpBind = this.mouseUp.bind(this);
        this.mouseDownBind = this.mouseDown.bind(this);
        this.mouseOverBind = this.mouseOver.bind(this);
        this.mouseOutBind = this.mouseOut.bind(this);
        this.lockPosition = lockPosition;
    }

    load() {
        emitEvent(eventNames.ON_LOAD, this);
        super.load();
        this.container.interactive = true;
        this.container.on('mouseup', this.mouseUpBind);
        this.container.on('mousedown', this.mouseDownBind);
        this.container.on('mouseover', this.mouseOverBind);
        this.container.on('mouseout', this.mouseOutBind);
    }

    unload() {
        emitEvent(eventNames.ON_UNLOAD, this);
        super.unload();
        this.container.off('mousemove', this.moveBind);
        this.container.off('mouseup', this.mouseUpBind);
        this.container.off('mousedown', this.mouseDownBind);
        this.container.off('mouseover', this.mouseOverBind);
        this.container.off('mouseout', this.mouseOutBind);
    }

    move(e) {
        emitEvent(eventNames.ON_MOUSE_MOVE, this, e.data.global.x, e.data.global.y);
        this.moving = true;
        this.container.x = e.data.global.x;
        this.container.y = e.data.global.y;
    }

    mouseDown() {
        emitEvent(eventNames.ON_MOUSE_DOWN, this);
        if (this.lockPosition) return;
        this.container.on('mousemove', this.moveBind);
    }

    mouseUp() {
        emitEvent(eventNames.ON_MOUSE_UP, this);
        this.container.off('mousemove', this.moveBind);
        this.resetVelocity();
        this.moving = false;
    }

    mouseOut() {
        emitEvent(eventNames.ON_MOUSE_OUT, this);
    }

    mouseOver() {
        emitEvent(eventNames.ON_MOUSE_OVER, this);
    }
}

class Controllable extends BaseSprite {
    constructor(texture, useGravity) {
        super(texture, useGravity);
        this.velocity = 0.01;
        this.amount = 0.01;
    }

    load() {
        super.load();
    }

    unload() {
        super.unload();
    }

    control(up, left, down, right, delta) {
        if (up.isDown) {
            this.moveDirection('y', -this.amount, -this.velocity * delta);
        }

        if (up.isUp) {
            if (this.container.y + this.container.height / 2 < Game.renderer.height) {
                this.floor = false;
            }
        }

        if (left.isDown) {
            this.moveDirection('x', -this.amount, -this.velocity * delta);
        }

        if (right.isDown) {
            this.moveDirection('x', this.amount, this.velocity * delta);
        }

        if (down.isDown) {
            this.moveDirection('y', this.amount, this.velocity * delta);
        }
    }

    moveDirection(axis, amount, velocity = 0) {
        if (velocity > 0 || velocity < 0) {
            if (velocity < 0) {
                this.container[`v${axis}`] -= Math.abs(velocity);
            } else {
                this.container[`v${axis}`] += velocity;
            }
        } else {
            this.container[axis] += amount;
        }
    }
}
