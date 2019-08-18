import * as alt from 'alt';
import * as native from 'natives';

// Synchronize the clothing sent down from the server.
export function syncClothing(jsonData) {
    const data = JSON.parse(jsonData);

    for (let key in data) {
        native.setPedComponentVariation(
            alt.Player.local.scriptID,
            data[key].id,
            data[key].value,
            data[key].texture,
            0
        );
    }
}
