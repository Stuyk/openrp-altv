const Application = PIXI.Application;
const Loader = PIXI.loader;
const Resources = PIXI.loader.resources;
const Sprite = PIXI.Sprite;
const Game = new PIXI.Application({
    width: 800,
    height: 600,
    resolution: 1,
    transparent: true
});
const TextStyle = PIXI.TextStyle;
const Text = PIXI.Text;
const TextMetrics = PIXI.TextMetrics;

document.querySelector('#game').appendChild(Game.view);

async function loadTextures(texturesToLoad, callback) {
    for (let texture in texturesToLoad) {
        await new Promise(resolve => {
            PIXI.loader.add(`assets/${texturesToLoad[texture]}.png`).load(() => {
                resolve();
                console.log(`Loaded TExture: ${texturesToLoad[texture]}`);
            });
        });
    }

    callback();
}

function rescale(width, height) {
    const newWidth = width / Game.renderer.width;
    const newHeight = height / Game.renderer.height;
    return [newWidth, newHeight];
}

function setDescription(title) {
    document.querySelector('#description').innerHTML = title;
}

function rgbToHex(r, g, b) {
    return '0x' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const keyboard = value => {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener('keydown', downListener, false);
    window.addEventListener('keyup', upListener, false);

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener('keydown', downListener);
        window.removeEventListener('keyup', upListener);
    };

    return key;
};

const eventNames = {
    ON_COLLIDE: 'onCollide',
    ON_COLLECT: 'onCollect',
    ON_UNLOAD: 'onUnload',
    ON_LOAD: 'onLoad',
    ON_CLICK: 'onClick',
    ON_GAME_BOUNDS: 'onGameBounds',
    ON_MOVE: 'onMove'
};

const scoreStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 'white',
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 2
});
const up = keyboard('w');
const left = keyboard('a');
const down = keyboard('s');
const right = keyboard('d');

let moveableSprites = [];
let staticSprites = [];
let clickableSprites = [];
let eventHandlers = new Map();
let ready = false;

const resetGame = async callback => {
    for (let i = moveableSprites.length - 1; i > -1; i--) {
        await new Promise(resolve => {
            moveableSprites[i].unload(() => {
                resolve();
            });
        });
    }

    for (let i = staticSprites.length - 1; i > -1; i--) {
        await new Promise(resolve => {
            staticSprites[i].unload(() => {
                resolve();
            });
        });
    }

    for (let i = clickableSprites.length - 1; i > -1; i--) {
        await new Promise(resolve => {
            clickableSprites[i].unload(() => {
                resolve();
            });
        });
    }

    if (callback) {
        callback();
    }
};

const on = (eventName, callback) => {
    if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, [callback]);
    } else {
        let events = [...eventHandlers.get(eventName)];
        events.push(callback);
        eventHandlers.set(eventName, events);
    }
};

function emitEvent(...args) {
    const [eventName] = args;
    if (!eventHandlers.has(eventName)) return;

    const events = eventHandlers.get(eventName);
    events.forEach(callback => {
        callback(args);
    });
}

const hitTestRectangle = (r1, r2) => {
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        } else {
            //There's no collision on the y axis
            hit = false;
        }
    } else {
        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};

class ClickableSprite {
    constructor(spriteName, removeOnClick = false) {
        this.sprite = new Sprite(
            PIXI.loader.resources[`assets/${spriteName}.png`].texture
        );
        this.sprite.buttonMode = true;
        this.moveObjectBind = this.moveObject.bind(this);
        this.mouseupBind = this.mouseup.bind(this);
        this.mousedownBind = this.mousedown.bind(this);
        this.mouseoverBind = this.mouseover.bind(this);
        this.mouseoutBind = this.mouseout.bind(this);
        this.removeOnClick = removeOnClick;
    }

    moveObject(e) {
        emitEvent(eventNames.ON_MOVE, this);
        if (!this.sprite) return;
        this.sprite.x = e.data.global.x - this.sprite.width / 2;
        this.sprite.y = e.data.global.y - this.sprite.height / 2;
    }

    load(callback) {
        clickableSprites.push(this);
        emitEvent(eventNames.ON_LOAD, this);
        Game.stage.addChild(this.sprite);
        this.sprite.interactive = true;
        this.sprite.on('mousedown', this.mousedownBind);
        this.sprite.on('mouseupoutside', this.mouseupBind);
        this.sprite.on('mouseup', this.mouseupBind);
        this.sprite.on('mouseover', this.mouseoverBind);
        this.sprite.on('mouseout', this.mouseoutBind);

        if (callback) {
            callback();
        }
    }

    unload(callback) {
        emitEvent(eventNames.ON_UNLOAD, this);
        this.sprite.off('mousedown', this.mousedownBind);
        this.sprite.off('mouseupoutside', this.mouseupBind);
        this.sprite.off('mouseup', this.mouseupBind);
        Game.stage.removeChild(this.sprite);
        const index = clickableSprites.findIndex(sprite => {
            if (sprite && sprite === this) return sprite;
        });
        if (index <= -1) {
            callback();
            return;
        }
        clickableSprites.splice(index, 1);
        callback();
    }

    mouseup() {
        this.clickedSprite = undefined;
        this.sprite.off('mousemove', this.moveObjectBind);
    }

    mousedown() {
        this.clickedSprite = this.sprite;
        if (this.removeOnClick) {
            this.unload();
            emitEvent(eventNames.ON_CLICK, this);
            return;
        }

        emitEvent(eventNames.ON_CLICK, this);
        this.sprite.on('mousemove', this.moveObjectBind);
    }

    mouseover() {
        this.sprite.alpha = 0.8;
    }

    mouseout() {
        this.sprite.alpha = 1.0;
    }

    gameBounds() {
        if (this.sprite.x + this.sprite.width > Game.renderer.width) {
            this.sprite.x = Game.renderer.width - this.sprite.width;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'right');
        }

        if (this.sprite.y + this.sprite.height > Game.renderer.height) {
            this.sprite.y = Game.renderer.height - this.sprite.height;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'down');
        }

        if (this.sprite.y < 0) {
            this.sprite.y = 0;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'up');
        }

        if (this.sprite.x < 0) {
            this.sprite.x = 0;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'left');
        }
    }

    onStaticCollision(collidedSprite) {
        emitEvent(eventNames.ON_COLLIDE, collidedSprite, this);
        if (collidedSprite.collectable) {
            collidedSprite.unload();
            emitEvent(eventNames.ON_COLLECT, collidedSprite);
        }
    }
}

class MoveableSprite {
    constructor(spriteName, amount, useVelocity = false, maxVelocity = 1) {
        this.sprite = new Sprite(
            PIXI.loader.resources[`assets/${spriteName}.png`].texture
        );
        this.amount = amount;
        this.useVelocity = useVelocity;
        this.maxVelocity = maxVelocity;
    }

    load(callback) {
        moveableSprites.push(this);
        emitEvent(eventNames.ON_LOAD, this);
        Game.stage.addChild(this.sprite);
        if (this.useVelocity) {
            this.sprite.vx = 0;
            this.sprite.vy = 0;
        }

        if (callback) {
            callback();
        }
    }

    unload(callback) {
        emitEvent(eventNames.ON_UNLOAD, this);
        Game.stage.removeChild(this.sprite);
        const index = moveableSprites.findIndex(sprite => {
            if (sprite && sprite === this) return sprite;
        });
        if (index <= -1) {
            if (callback) {
                callback();
            }
            return;
        }
        moveableSprites.splice(index, 1);
        if (callback) {
            callback();
        }
    }

    onStaticCollision(collidedSprite) {
        emitEvent(eventNames.ON_COLLIDE, collidedSprite, this);
        if (collidedSprite.collectable) {
            collidedSprite.unload();
            emitEvent(eventNames.ON_COLLECT, this);
        }
    }

    gameBounds() {
        if (this.sprite.x + this.sprite.width > Game.renderer.width) {
            this.sprite.x = Game.renderer.width - this.sprite.width;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'right');
        }

        if (this.sprite.y + this.sprite.height > Game.renderer.height) {
            this.sprite.y = Game.renderer.height - this.sprite.height;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'down');
        }

        if (this.sprite.y < 0) {
            this.sprite.y = 0;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'up');
        }

        if (this.sprite.x < 0) {
            this.sprite.x = 0;
            emitEvent(eventNames.ON_GAME_BOUNDS, this, 'left');
        }
    }
}

class StaticSprite {
    constructor(spriteName, isCollectable = false) {
        this.sprite = new Sprite(
            PIXI.loader.resources[`assets/${spriteName}.png`].texture
        );
        this.collectable = isCollectable;
    }

    load(callback) {
        staticSprites.push(this);
        emitEvent(eventNames.ON_LOAD, this);
        Game.stage.addChild(this.sprite);

        if (callback) {
            callback();
        }
    }

    unload(callback) {
        emitEvent(eventNames.ON_UNLOAD, this);
        Game.stage.removeChild(this.sprite);
        const index = staticSprites.findIndex(sprite => {
            if (sprite && sprite === this) return sprite;
        });
        if (index <= -1) {
            if (callback) {
                callback();
            }
            return;
        }
        staticSprites.splice(index, 1);
        if (callback) {
            callback();
        }
    }
}

function moveSprite(mvSprite, axis, amount, maxVelocity) {
    if (mvSprite.useVelocity) {
        mvSprite.sprite[`v${axis}`] += amount;
        if (amount > 0) {
            if (mvSprite.sprite[`v${axis}`] > maxVelocity) {
                mvSprite.sprite[`v${axis}`] = maxVelocity;
            }
        } else {
            if (mvSprite.sprite[`v${axis}`] < maxVelocity) {
                mvSprite.sprite[`v${axis}`] = maxVelocity;
            }
        }
    } else {
        mvSprite.sprite[axis] += amount;
    }
}

const spriteHandler = currentSprite => {
    let isColliding = false;
    staticSprites.forEach(staticSprite => {
        if (hitTestRectangle(staticSprite.sprite, currentSprite.sprite)) {
            currentSprite.onStaticCollision(staticSprite);
            isColliding = true;
        }
    });

    if (currentSprite.constructor.name === 'MoveableSprite') {
        if (up.isDown) {
            if (!isColliding) {
                moveSprite(
                    currentSprite,
                    'y',
                    currentSprite.amount * -1,
                    currentSprite.maxVelocity * -1
                );
            } else {
                currentSprite.sprite.y -= 1;
            }
        }

        if (left.isDown) {
            if (!isColliding) {
                moveSprite(
                    currentSprite,
                    'x',
                    currentSprite.amount * -1,
                    currentSprite.maxVelocity * -1
                );
            } else {
                currentSprite.sprite.x -= 1;
            }
        }

        if (right.isDown) {
            if (!isColliding) {
                moveSprite(
                    currentSprite,
                    'x',
                    currentSprite.amount,
                    currentSprite.maxVelocity
                );
            } else {
                currentSprite.sprite.x += 1;
            }
        }

        if (down.isDown) {
            if (!isColliding) {
                moveSprite(
                    currentSprite,
                    'y',
                    currentSprite.amount,
                    currentSprite.maxVelocity
                );
            } else {
                currentSprite.sprite.y += 1;
            }
        }

        if (currentSprite.useVelocity && !isColliding) {
            currentSprite.sprite.y += currentSprite.sprite.vy;
            currentSprite.sprite.x += currentSprite.sprite.vx;
        }
    }

    if (currentSprite.gameBounds) {
        currentSprite.gameBounds();
    }
};

const gameLoop = delta => {
    if (!ready) {
        ready = true;
        alt.emit('minigame:Ready');
    }

    if (moveableSprites.length >= 1) {
        moveableSprites.forEach(spriteHandler);
    }

    if (clickableSprites.length >= 1) {
        clickableSprites.forEach(spriteHandler);
    }
};

Game.ticker.add(delta => gameLoop(delta));
Game.stage.sortableChildren = true;
