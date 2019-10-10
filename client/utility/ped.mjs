import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->utility->ped.mjs');

export class Ped {
    constructor(model, pos) {
        native.requestModel(native.getHashKey(model));
        alt.nextTick(() => {
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
            native.taskSetBlockingOfNonTemporaryEvents(this.scriptID, 1);
            native.setBlockingOfNonTemporaryEvents(this.scriptID, 1);
            native.setPedFleeAttributes(this.scriptID, 0, 0);
            native.setPedCombatAttributes(this.scriptID, 17, 1);
        });
    }

    destroy() {
        native.deleteEntity(this.scriptID);
    }
}
