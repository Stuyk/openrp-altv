import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->utility->ped.mjs');

export class Ped {
    constructor(model, pos) {
        this.scriptID = native.createPed(
            1,
            native.getHashKey(model),
            pos.x,
            pos.y,
            pos.z,
            0,
            false,
            false
        );
    }

    destroy() {
        native.deleteEntity(this.scriptID);
    }
}
