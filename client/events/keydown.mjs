import * as alt from 'alt';
import * as systemsContext from 'client/systems/context.mjs';

alt.log('Loaded: client->events->keydown.mjs');

let keybinds = {};
let cooldown = false;

alt.on('meta:Changed', loadInterval);

// Only starts the interval after the player has logged in.
function loadInterval(key) {
    if (key !== 'loggedin') return;
    alt.off('meta:Changed', loadInterval);
    if (Object.keys(keybinds).length <= 0) return;
    alt.on('keydown', keydown);
}

function keydown(key) {
    if (!alt.Player.local.getMeta('loggedin')) return;
    if (alt.Player.local.getMeta('chat')) return;

    if (cooldown) return;

    if (keybinds[key] !== undefined) {
        cooldown = true;
        keybinds[key]();

        alt.setTimeout(() => {
            cooldown = false;
        }, 200);
    }
}
