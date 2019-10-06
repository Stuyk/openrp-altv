const textures = ['box', 'leaf1', 'leaf2'];

const leafCount = 100;
let treasure;
let hash;

setDescription('Find the box under the leaves.');

const setupGame = async () => {
    treasure = new ClickableSprite('box', false);
    treasure.load();

    const positions = [];
    for (let i = 0; i < leafCount; i++) {
        let clickable = await new ClickableSprite('leaf1', false);
        clickable.sprite.x = Math.random() * Game.renderer.width;
        clickable.sprite.y = Math.random() * Game.renderer.height;
        positions.push({ x: clickable.sprite.x, y: clickable.sprite.y });
        clickable.sprite.tint = parseInt(
            rgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255)
        );
        await new Promise(resolve => {
            clickable.load(() => {
                resolve();
            });
        });
    }

    const randomPos = Math.floor(Math.random() * (positions.length - 1));
    treasure.sprite.x = positions[randomPos].x;
    treasure.sprite.y = positions[randomPos].y;
    treasure.sprite.scale.set(0.5, 0.5);
    state = 'FindInLeaves';
};

on(eventNames.ON_CLICK, args => {
    if (state !== 'FindInLeaves') return;
    const [event, clickable] = args;

    if (clickable === treasure) {
        if ('alt' in window) {
            alt.emit('minigame:Complete', hash);
        } else {
            /*
            resetGame(() => {
                setupGame();
            });
            */
        }
    }
});

if ('alt' in window) {
    alt.on('minigame:FindInLeaves', gamehash => {
        loadTextures(textures, () => {
            hash = gamehash;
            setupGame();
        });
    });
} else {
    /*
    loadTextures(textures, () => {
        setupGame();
    });
    */
}

/*
on(eventNames.ON_COLLECT, e => {
    console.log('Collected');
    console.log(e);
});

on(eventNames.ON_LOAD, e => {
    console.log('Loaded');
    console.log(e);
});

on(eventNames.ON_COLLIDE, e => {
    console.log('Collided');
    console.log(e);
});

on(eventNames.ON_GAME_BOUNDS, args => {
    console.log(args);
    //console.log(args);
    //const [sprite, side] = args;
    //console.log(`Hit Game Bounds ${side}`);
});

on(eventNames.ON_MOVE, e => {
    console.log('MOVING OBJECT WITH MOUSE');
    console.log(e);
});
*/
