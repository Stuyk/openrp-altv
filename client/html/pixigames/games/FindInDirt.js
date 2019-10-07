const findInDirtTextures = ['seed', 'dirt'];
let seed;

setDescription('Find the dropped seeds under the dirt.');

const setupDirtGame = async () => {
    seed = new ClickableSprite('seed', false);
    seed.load();
    let [width, height] = rescale(100, 85);

    seed.sprite.scale = new PIXI.Point(width, height);

    const positions = [];
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 8; y++) {
            const tileWidthSpace = 80;
            const tileHeightSpace = 75;
            const dirt = new ClickableSprite('dirt', false, 1);
            dirt.noTransparency = true;
            [width, height] = rescale(124.5, 87.5);
            dirt.sprite.scale = new PIXI.Point(width, height);
            dirt.sprite.x = tileWidthSpace * x;
            dirt.sprite.y = tileHeightSpace * y;
            dirt.load();
            positions.push({
                x: dirt.sprite.x + tileWidthSpace / 2,
                y: dirt.sprite.y + tileHeightSpace / 2
            });
        }
    }

    const randomPos = Math.floor(Math.random() * (positions.length - 1));
    seed.sprite.x = positions[randomPos].x;
    seed.sprite.y = positions[randomPos].y;
    isFindInDirtActive = true;
    state = 'FindInDirt';
    setDescription('Find the seed under the dirt.');
};

on(eventNames.ON_CLICK, args => {
    if (state !== 'FindInDirt') return;
    const [event, clickable] = args;

    if (clickable === seed) {
        if ('alt' in window) {
            alt.emit('minigame:Complete', hash);
        } else {
            resetGame(() => {
                setupDirtGame();
            });
        }
    } else {
        playAudio('dig');
    }
});

if ('alt' in window) {
    alt.on('minigame:FindInDirt', gamehash => {
        loadTextures(findInDirtTextures, () => {
            hash = gamehash;
            setupDirtGame();
        });
    });
} else {
    loadTextures(findInDirtTextures, () => {
        setupDirtGame();
    });
}
