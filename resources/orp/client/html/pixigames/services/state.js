const GameStates = [];
let currentGameState;

class State {
    constructor(name, hash) {
        this.name = name;
        this.hash = hash;
        this.objects = [];
        GameStates.push(this);
    }

    add(sprite) {
        this.objects.push(sprite);
    }

    loadState() {
        let count = 0;
        this.objects.forEach(obj => {
            if (!obj.load) return;
            obj.load();
            count += 1;
        });
        console.log(`Loaded ${count} objects.`);
    }

    unloadState() {
        let count = 0;
        this.objects.forEach(obj => {
            if (!obj.unload) return;
            obj.unload();
            count += 1;
        });
        console.log(`Unloaded ${count} objects.`);
    }
}

function loadGameState(name) {
    if (currentGameState) {
        currentGameState.unloadState();
        currentGameState = undefined;
    }

    const newState = GameStates.find(state => state.name == name);
    if (!newState) {
        console.log('No game state was found.');
        return;
    }

    console.log(`Game State: ${name}`);
    newState.loadState();
    currentGameState = newState;
}
