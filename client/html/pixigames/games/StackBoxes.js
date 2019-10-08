const stackBoxesTextures = ['box'];

let firstClickedColor;
let secondClickedColor;
let stackableBoxes = [];

const setupStackBoxesGame = async () => {
    const [width, height] = rescale(375, 300);

    let randomPos = () => {
        return {
            x: Math.floor(Math.random() * Game.renderer.width),
            y: Math.floor(Math.random() * Game.renderer.height)
        };
    };

    for (let i = 0; i < 10; i++) {
        const color = rgbToHex(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        );
        let pos1 = randomPos();
        let block = new ClickableSprite('box', false);
        block.load();
        block.gravity = true;
        block.sprite.scale = new PIXI.Point(width, height);
        block.sprite.tint = color;
        block.sprite.x = pos1.x;
        block.sprite.y = pos1.y;
        stackableBoxes.push(block);
    }

    setDescription('Stack the boxes.');
    state = 'StackBoxes';
};

on(eventNames.ON_MOUSEUP, args => {
    if (state !== 'StackBoxes') return;
    const [event, clickable] = args;

    let sortedBoxes = stackableBoxes.sort((a, b) => {
        return a.sprite.y - b.sprite.y;
    });

    let complete = true;
    let lastBox;
    for (let i = 0; i < sortedBoxes.length; i++) {
        if (!lastBox) {
            lastBox = sortedBoxes[i];
            continue;
        }

        if (lastBox.sprite.y >= sortedBoxes[i].sprite.y) {
            complete = false;
            continue;
        }

        lastBox = sortedBoxes[i];
    }

    if (complete) {
        alt.emit('minigame:Complete', hash);
    }
});

if ('alt' in window) {
    alt.on('minigame:StackBoxes', gamehash => {
        loadTextures(stackBoxesTextures, () => {
            hash = gamehash;
            setupStackBoxesGame();
        });
    });
} else {
    loadTextures(stackBoxesTextures, () => {
        setupStackBoxesGame();
    });
}
