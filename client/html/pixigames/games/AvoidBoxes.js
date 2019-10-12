function AvoidBoxes(hash) {
    loadTextures(['box', 'person'], () => {
        const currentGame = new State('AvoidBoxes', hash);
        currentGame.usePhysics = true;
        currentGame.score = 0;

        const player = new Controllable('person', true);
        player.velocity = 0;
        player.amount = 2;
        player.container.width = 45;
        player.container.height = 45;
        player.container.sprite = 45;
        player.container.sprite = 45;
        player.container.x = Game.renderer.width / 2;
        player.container.y = Game.renderer.height - 50;
        currentGame.add(player);
        currentGame.player = player;

        setDescription('Avoid the boxes.');
        loadGameState('AvoidBoxes');

        setTimeout(async () => {
            for (let x = 0; x < 20; x++) {
                const box = new Clickable('box', true, true);
                box.container.width = 50;
                box.container.height = 50;
                box.container.x = Math.random() * Game.renderer.width;
                box.container.y = 1;
                //box.ignoreGameBounds = true;
                box.ignoreCollision = false;
                box.baseColor = rgbToHex(
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255)
                );
                box.container.sprite.tint = box.baseColor;
                currentGame.add(box);
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 500);
                });
                box.load();
            }

            setTimeout(() => {
                console.log('Done!');
                if ('alt' in window) {
                    alt.emit('minigame:Complete', currentGameState.hash);
                }
            }, 1000);
        }, 500);
    });
}

on(eventNames.ON_COLLIDE, ([event, obj1, obj2, side]) => {
    if (currentGameState && currentGameState.name !== 'AvoidBoxes') return;
    if (obj1 === currentGameState.player || obj2 === currentGameState.player) {
        if ('alt' in window) {
            alt.emit('minigame:Quit');
        } else {
            console.log('Failed!');
        }
        return;
    }
});

if ('alt' in window) {
    alt.on('minigame:AvoidBoxes', AvoidBoxes);
}
