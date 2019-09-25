import * as alt from 'alt';
import {
    Job,
    Objective,
    copyObjective,
    objectives,
    modifiers,
    restrictions
} from '../systems/job.mjs';
import { generateHash } from '../utility/encryption.mjs';

alt.on('job:Fishing', player => {
    if (player.isTryingFishing) return;
    player.isTryingFishing = true;
    const callbackEvent = generateHash(JSON.stringify(player));
    alt.onClient(callbackEvent, startFishing);
    alt.emitClient(player, 'job:isInWater', callbackEvent);
});

function startFishing(player, callbackEventName, isNearWater, castLocation) {
    alt.offClient(callbackEventName, startFishing);
    player.isTryingFishing = false;

    if (!isNearWater) {
        player.send('{FF0000}You must be near water to fish.');
        return;
    }

    if (!player.sector) {
        player.send(`{FF0000}You don't seem to have a sector. Re-enter the grid.`);
        return;
    }

    const job = new Job(
        player,
        'Fishing',
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    let obj;

    obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(player.pos);
    obj.setRange(5);
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    obj = new Objective(objectives.HOLD, modifiers.ON_FOOT);
    obj.setPosition(player.pos);
    obj.setRange(5);
    obj.setHelpText('Cast your line by holding ~INPUT_CONTEXT~.');
    obj.setFinishedSound('complete');
    obj.setMaxProgress(0);
    obj.setAnimationAndSound('mini@tennis', 'forehand_ts_md_far', 1, 1533, [
        { name: 'lightwhoosh', time: 0.1 }
    ]);
    job.add(copyObjective(obj));
    // markanim mini@tennis forehand_ts_md_far

    obj = new Objective(objectives.WAIT, modifiers.ON_FOOT);
    obj.setPosition(player.pos);
    obj.setRange(5);
    obj.useSectorForWaitTime();
    obj.setHelpText('Wait for a fish to bite...');
    obj.setMarker(
        28,
        castLocation,
        emptyVector,
        emptyVector,
        new alt.Vector3(0.2, 0.2, 0.2),
        0,
        255,
        0,
        255
    );
    obj.setFinishedSound('complete');
    obj.setAnimationAndSound('amb@world_human_stand_fishing@idle_a', 'idle_c', 1, -1);
    job.add(copyObjective(obj));

    obj = new Objective(objectives.ORDER, modifiers.ON_FOOT);
    obj.setPosition(player.pos);
    obj.setRange(5);
    obj.setHelpText('Press the keys on screen in order.');
    obj.setMarker(
        28,
        castLocation,
        emptyVector,
        emptyVector,
        new alt.Vector3(0.2, 0.2, 0.2),
        0,
        255,
        0,
        255
    );
    obj.setFinishedSound('complete');
    obj.setAnimationAndSound('amb@world_human_stand_fishing@idle_a', 'idle_c', 1, -1);
    obj.setRewards([{ type: 'xp', prop: 'fishing', quantity: 85 }]);
    job.add(copyObjective(obj));

    job.start(player);
}
