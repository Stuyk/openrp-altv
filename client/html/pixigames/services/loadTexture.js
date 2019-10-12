async function loadTextures(texturesToLoad, callback) {
    for (let texture in texturesToLoad) {
        await new Promise(resolve => {
            PIXI.loader.add(`assets/${texturesToLoad[texture]}.png`).load(() => {
                console.log(`Loaded Texture: ${texturesToLoad[texture]}`);
                resolve();
            });
        });
    }

    if (callback) {
        callback();
    }
}
