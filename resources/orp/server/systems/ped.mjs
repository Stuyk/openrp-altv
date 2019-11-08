import * as alt from 'alt';

let peds = [];
let nextPed = 0;

alt.onClient('ped:FleeFromPlayer', (player, serverID, forwardVector) => {
    const index = peds.findIndex(ped => ped && ped.id === serverID);
    if (index <= -1) return;
    if (!peds[index].modifyTime) {
        peds[index].modifyTime = Date.now() + 2000;
    }

    if (peds[index].modifyTime > Date.now()) return;
    peds[index].modifyTime = Date.now() + 2000;

    const pos = {
        x: peds[index].pos.x + forwardVector.x * 15,
        y: peds[index].pos.y + forwardVector.y * 15,
        z: peds[index].pos.z
    };

    peds[index].pos = pos;
    alt.emitClient(null, 'ped:MoveTo', serverID, pos);
});

alt.on('ped:CreatePed', (model, pos, fleeFromPlayer) => {
    nextPed += 1;
    const id = nextPed;
    peds.push({
        id,
        model,
        pos,
        fleeFromPlayer
    });
    // model, pos, id, fleeFromPlayer
    alt.emitClient(null, 'ped:CreatePedByID', model, pos, id, fleeFromPlayer);
});
