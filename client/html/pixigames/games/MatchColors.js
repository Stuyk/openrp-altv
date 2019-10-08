const colorMatchTextures = ['box'];

let firstClickedColor;
let secondClickedColor;

const setupColorMatchGame = async () => {
    const [width, height] = rescale(375, 300);

    let randomPos = () => {
        return {
            x: Math.floor(Math.random() * Game.renderer.width),
            y: Math.floor(Math.random() * Game.renderer.height)
        };
    };

    for (let i = 0; i < 5; i++) {
        const color = rgbToHex(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        );
        let pos1 = randomPos();
        let pos2 = randomPos();
        let block = new ClickableSprite('box', false);
        block.load();
        block.gravity = true;
        block.sprite.scale = new PIXI.Point(width, height);
        block.sprite.tint = color;
        block.sprite.x = pos1.x;
        block.sprite.y = pos1.y;

        block = new ClickableSprite('box', false);
        block.load();
        block.gravity = true;
        block.sprite.scale = new PIXI.Point(width, height);
        block.sprite.tint = color;
        block.sprite.x = pos2.x;
        block.sprite.y = pos2.y;
    }

    setDescription('Match the colors.');
    state = 'MatchColors';
};

on(eventNames.ON_CLICK, args => {
    if (state !== 'MatchColors') return;
    const [event, clickable] = args;

    /*
    if (!firstClickedColor) {
        firstClickedColor = clickable;
        return;
    }

    if (!secondClickedColor) {
        secondClickedColor = clickable;
        if (firstClickedColor !== secondClickedColor) {
            if (firstClickedColor.sprite.tint === secondClickedColor.sprite.tint) {
                firstClickedColor.unload();
                secondClickedColor.unload();
            }
        }

        firstClickedColor = undefined;
        secondClickedColor = undefined;
    }

    /*
    if (clickable === seed) {
        if ('alt' in window) {
            alt.emit('minigame:Complete', hash);
        } else {
            resetGame(() => {
                setupColorMatchGame();
            });
        }
    } else {
        playAudio('dig');
    }
    */
});

if ('alt' in window) {
    alt.on('minigame:FindInDirt', gamehash => {
        loadTextures(colorMatchTextures, () => {
            hash = gamehash;
            setupColorMatchGame();
        });
    });
} else {
    loadTextures(colorMatchTextures, () => {
        setupColorMatchGame();
    });
}
