let eventHandlers = new Map();
const eventNames = {
    ON_COLLIDE: 'onCollide',
    ON_COLLECT: 'onCollect',
    ON_UNLOAD: 'onUnload',
    ON_LOAD: 'onLoad',
    ON_MOUSE_DOWN: 'onMouseDown',
    ON_MOUSE_UP: 'onMouseUp',
    ON_MOUSE_MOVE: 'onMouseMove',
    ON_MOUSE_OVER: 'onMouseOver',
    ON_MOUSE_OUT: 'onMouseOut',
    ON_GAME_BOUNDS: 'onGameBounds',
    ON_KEYDOWN: 'onKeyDown',
    ON_KEYUP: 'onKeyUp',
    ON_LEFT_GAME_BOUNDS: 'onLeftGameBounds'
};

function on(eventName, callback) {
    if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, [callback]);
    } else {
        let events = [...eventHandlers.get(eventName)];
        events.push(callback);
        eventHandlers.set(eventName, events);
    }
}

function emitEvent(...args) {
    const [eventName] = args;
    if (!eventHandlers.has(eventName)) return;

    const events = eventHandlers.get(eventName);
    events.forEach(callback => {
        callback(args);
    });
}
