function stackTheBoxes(hash) {
    loadTextures(['box'], () => {
        const currentGame = new State('StackTheBoxes', hash);
        currentGame.usePhysics = true;

        for (let x = 0; x < 8; x++) {
            const box = new Clickable('box', true, false);
            box.container.width = 50;
            box.container.height = 50;
            box.container.x = Math.random() * Game.renderer.width;
            box.container.y = Math.random() * Game.renderer.height;
            currentGame.add(box);
        }

        setDescription('Stack the boxes.');
        loadGameState('StackTheBoxes');
    });
}

on(eventNames.ON_MOUSE_UP, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'StackTheBoxes') return;

    const sortedBoxes = currentGameState.objects.sort((a, b) => {
        return a.container.y - b.container.y;
    });

    let complete = true;
    let lastBox;
    for (let i = 0; i < sortedBoxes.length; i++) {
        if (!lastBox) {
            lastBox = sortedBoxes[i];
            continue;
        }

        if (lastBox.container.y >= sortedBoxes[i].container.y) {
            complete = false;
            continue;
        }

        lastBox = sortedBoxes[i];
    }

    if (complete) {
        console.log('Done!');
        if ('alt' in window) {
            alt.emit('minigame:Complete', currentGameState.hash);
        }
    }
});

on(eventNames.ON_MOUSE_OVER, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'StackTheBoxes') return;
    const color = rgbToHex(150, 150, 150);
    object.container.sprite.tint = color;
});

on(eventNames.ON_MOUSE_OUT, ([event, object]) => {
    if (currentGameState && currentGameState.name !== 'StackTheBoxes') return;
    object.container.sprite.tint = 0xffffff;
});

if ('alt' in window) {
    alt.on('minigame:StackTheBoxes', stackTheBoxes);
}
