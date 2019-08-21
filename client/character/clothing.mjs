import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->character->clothing.mjs');

// Synchronize the clothing sent down from the server.
export function syncClothing(jsonData) {
    const data = JSON.parse(jsonData);

    for (let key in data) {
        if (!data[key].isProp) {
            native.setPedComponentVariation(
                alt.Player.local.scriptID,
                data[key].id,
                data[key].value,
                data[key].texture,
                0
            );
        } else {
            native.setPedPropIndex(
                alt.Player.local.scriptID,
                data[key].id,
                data[key].value,
                data[key].texture,
                true
            );

            if (data[key].value === -1) {
                native.clearPedProp(alt.Player.local.scriptID, data[key].id);
            }
        }
    }
}
