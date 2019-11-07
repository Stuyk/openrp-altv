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
const b = new Bump(PIXI);
const loadingText = new Text('Loading...');
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center',
    stroke: 'black',
    strokeThickness: 2
});
const text = new PIXI.Text('Loading...', style);
const textMetrics = PIXI.TextMetrics.measureText('Loading...', style);
const startTime = Date.now();
let ready = false;

document.querySelector('#game').appendChild(Game.view);

function gameLoop(delta) {
    if (!ready) {
        ready = true;
        if ('alt' in window) {
            setTimeout(() => {
                alt.emit('minigame:Ready');
            }, 2000);
        }
    }

    if (!currentGameState) {
        return;
    }

    if (Game.stage.children.includes(text)) {
        Game.stage.removeChild(text);
    }

    if (!currentGameState.usePhysics) return;
    currentGameState.objects.forEach(obj1 => {
        obj1.checkGameBounds();

        if (!obj1.ignoreGravity) {
            obj1.gravity(delta);
        }

        if (obj1.constructor.name === 'Controllable') {
            obj1.control(up, left, down, right, delta);
        }

        if (!obj1.ignoreCollision) {
            currentGameState.objects.forEach(obj2 => {
                if (obj1 === obj2) return;

                if (obj2.constructor.name === 'StaticPassThrough') return;
                if (obj1.constructor.name === 'StaticPassThrough') {
                    if (b.hitTestRectangle(obj1, obj2)) {
                        emitEvent(eventNames.ON_PASS_THROUGH, obj1, obj2);
                        return;
                    }
                    return;
                }

                const directionHit = b.hit(obj1.container, obj2.container, true, false);
                switch (directionHit) {
                    case 'bottom':
                        obj1.floor = true;
                        obj1.container.vy = 0;
                        emitEvent(eventNames.ON_COLLIDE, obj1, obj2, directionHit);
                        break;
                    case 'left':
                        obj1.container.vx = 0;
                        emitEvent(eventNames.ON_COLLIDE, obj1, obj2, directionHit);
                        break;
                    case 'right':
                        obj1.container.vx = 0;
                        emitEvent(eventNames.ON_COLLIDE, obj1, obj2, directionHit);
                        break;
                    case 'top':
                        obj1.container.vy = 0;
                        emitEvent(eventNames.ON_COLLIDE, obj1, obj2, directionHit);
                        break;
                    default:
                        break;
                }
            });
        }
    });
}

text.x = Game.renderer.width / 2 - textMetrics.width / 2;
text.y = Game.renderer.height / 2 - textMetrics.height / 2;
Game.ticker.add(delta => gameLoop(delta));
Game.stage.sortableChildren = true;
Game.stage.addChild(text);

on(eventNames.ON_KEYDOWN, ([event, key]) => {
    if (key === 'Escape') {
        if ('alt' in window) {
            alt.emit('minigame:Quit');
        } else {
            console.log('Quit Minigame');
        }
    }
});
