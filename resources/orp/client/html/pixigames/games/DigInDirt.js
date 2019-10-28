function digInDirt(hash) {
    loadTextures(['dirt', 'seed'], () => {
        const currentGame = new State('DigInDirt', hash);
        const columns = 10;
        const rows = 10;
        const width = Game.renderer.width / columns;
        const height = Game.renderer.height / rows;

        const seed = new Clickable('seed', false, true);
        seed.container.width = width / 2;
        seed.container.height = height / 3;
        currentGame.add(seed);
        currentGame.usePhysics = false;
        currentGame.goal = seed;

        let positions = [];
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                const dirt = new Clickable('dirt', false, true);
                dirt.container.width = width;
                dirt.container.height = height;
                dirt.container.x = width * x + dirt.container.width / 2;
                dirt.container.y = height * y + dirt.container.height / 2;
                currentGame.add(dirt);
                positions.push({ x: dirt.container.x, y: dirt.container.y });
            }
        }

        let index = Math.floor(Math.random() * (positions.length - 1));
        seed.container.x = positions[index].x;
        seed.container.y = positions[index].y;
        setDescription('Dig in the dirt; and find the seed.');
        loadGameState('DigInDirt');
    });
}

on(eventNames.ON_MOUSE_DOWN, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'DigInDirt') return;
    object.unload();

    if (object === currentGameState.goal) {
        console.log('Done!');
        if ('alt' in window) {
            alt.emit('minigame:Complete', currentGameState.hash);
        }
    }
});

on(eventNames.ON_MOUSE_OVER, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'DigInDirt') return;
    const color = rgbToHex(200, 200, 200);
    object.container.sprite.tint = color;
});

on(eventNames.ON_MOUSE_OUT, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'DigInDirt') return;
    object.container.sprite.tint = 0xffffff;
});

if ('alt' in window) {
    alt.on('minigame:DigInDirt', digInDirt);
}
