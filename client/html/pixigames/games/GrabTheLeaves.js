function grabTheLeaves(hash) {
    loadTextures(['leaf1'], () => {
        const currentGame = new State('grabTheLeaves', hash);
        currentGame.usePhysics = true;
        currentGame.score = 0;

        for (let x = 0; x < 10; x++) {
            const leaf = new Clickable('leaf1', true, true);
            const size = Math.random() * 50 + 50;
            leaf.container.width = size;
            leaf.container.height = size;
            leaf.container.x = Math.random() * Game.renderer.width;
            leaf.container.y = Math.random() * Game.renderer.height;
            leaf.ignoreGameBounds = true;
            leaf.ignoreCollision = true;
            leaf.rotateClockwise = true;
            leaf.container.rotation = Math.random() * 360;
            leaf.baseColor = rgbToHex(
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255)
            );
            leaf.container.sprite.tint = leaf.baseColor;

            currentGame.add(leaf);
        }

        setDescription('Grab 5 leaves.');
        loadGameState('grabTheLeaves');
    });
}

on(eventNames.ON_MOUSE_DOWN, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'grabTheLeaves') return;

    object.unload();
    currentGameState.score += 1;

    if (currentGameState.score >= 5) {
        console.log('Done!');
        if ('alt' in window) {
            alt.emit('minigame:Complete', currentGameState.hash);
        }
    }
});

on(eventNames.ON_LEFT_GAME_BOUNDS, ([event, object, direction]) => {
    if (currentGameState && currentGameState.name !== 'grabTheLeaves') return;
    if (direction !== 'bottom') return;
    setTimeout(() => {
        object.container.y = -100;
    }, 500);
});

on(eventNames.ON_MOUSE_OVER, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'grabTheLeaves') return;
    const color = rgbToHex(150, 150, 150);
    object.container.sprite.tint = color;
});

on(eventNames.ON_MOUSE_OUT, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'grabTheLeaves') return;
    object.container.sprite.tint = object.baseColor;
});

if ('alt' in window) {
    alt.on('minigame:GrabTheLeaves', grabTheLeaves);
}
