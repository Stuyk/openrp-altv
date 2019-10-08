import * as alt from 'alt';
import {
    Job,
    Objective,
    copyObjective,
    objectives,
    modifiers,
    restrictions
} from '../systems/job.mjs';
import { Interaction } from '../systems/interaction.mjs';

const jobName = 'Kevlarium Refinery';
const trackStart = {
    x: 3530.47900390625,
    y: 3664.44384765625,
    z: 28.1171875
};

/*
[
	,
	,
	{
		"x": 3538.892333984375,
		"y": 3668.21533203125,
		"z": 28.1171875
	},
	{
		"x": 3534.421875,
		"y": 3659.67041015625,
		"z": 28.1171875
	}
]
*/

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:RefineVigorium1',
    3,
    3,
    'to begin refining vigoirum.'
);
interaction.addBlip(365, 6, jobName);

alt.on('job:RefineVigorium1', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'unrefinedvigorium', hasItem: true }]);
    let obj;
    let pos;

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(5);
    obj.setHelpText('');
    obj.setBlip(367, 2, trackStart);
    obj.setMarker(
        0,
        trackStart,
        emptyVector,
        emptyVector,
        new alt.Vector3(1, 1, 1),
        0,
        255,
        0,
        100
    );
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    pos = {
        x: 3537.098876953125,
        y: 3664.41748046875,
        z: 28.1171875
    };
    obj = new Objective(objectives.POINT, modifiers.ON_FOOT | modifiers.REMOVE_ITEM);
    obj.setHelpText('Walk to the center of the lab.');
    obj.setPosition(pos);
    obj.setBlip(367, 2, pos);
    obj.setRange(3);
    obj.setMarker(
        0,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(1, 1, 1),
        0,
        255,
        0,
        100
    );
    obj.setFinishedSound('complete');
    obj.setMaxProgress(5);
    obj.setRemoveItem([{ key: 'unrefinedvigorium', quantity: 1 }]);
    job.add(copyObjective(obj));

    pos = {
        x: 3538.892333984375,
        y: 3668.21533203125,
        z: 28.1171875
    };
    obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
    obj.setHelpText('Mash to ~INPUT_CONTEXT~ to refine vigorium.');
    obj.setPosition(pos);
    obj.setBlip(367, 2, pos);
    obj.setRange(3);
    obj.setMarker(
        0,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(1, 1, 1),
        0,
        255,
        0,
        100
    );
    obj.setFinishedSound('complete');
    obj.setRewards([
        { type: 'xp', prop: 'crafting', quantity: 20 },
        { type: 'xp', prop: 'notoriety', quantity: 25 },
        { type: 'xp', prop: 'nobility', quantity: -75 }
    ]);
    obj.setMaxProgress(10);
    obj.setAnimationAndSound(
        'anim@amb@business@coc@coc_packing@',
        'operate_press_basicmould_v3_pressoperator',
        1,
        -1
    );
    /*
    obj.setParticleEffect([
        {
            dict: 'core',
            name: 'ent_amb_smoke_foundry',
            duration: 200,
            scale: 1,
            offset: { x: 0, y: 1, z: 0 },
            time: 0.06 // Animation times to play at.
        }
    ]);
    */
    job.add(copyObjective(obj));

    pos = {
        x: 3534.421875,
        y: 3659.67041015625,
        z: 28.1171875
    };
    obj = new Objective(objectives.HOLD, modifiers.ON_FOOT);
    obj.setHelpText('Hold ~INPUT_CONTEXT~ to finish the refinery process.');
    obj.setPosition(pos);
    obj.setBlip(367, 2, pos);
    obj.setRange(3);
    obj.setMarker(
        0,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(1, 1, 1),
        0,
        255,
        0,
        100
    );
    obj.setMaxProgress(8);
    obj.setFinishedSound('complete');
    obj.setRewards([
        { type: 'xp', prop: 'crafting', quantity: 20 },
        { type: 'item', prop: 'refinedvigorium', quantity: 1 },
        { type: 'xp', prop: 'notoriety', quantity: 25 },
        { type: 'xp', prop: 'nobility', quantity: -75 }
    ]);
    job.add(copyObjective(obj));

    job.start(player);
});
