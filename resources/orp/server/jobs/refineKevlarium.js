import * as alt from 'alt';
import {
    Job,
    Objective,
    copyObjective,
    objectives,
    modifiers,
    restrictions
} from '../systems/job.js';
import { Interaction } from '../systems/interaction.js';
import { doesUserHaveTurfAccess } from '../systems/factions.js';

const jobName = 'Kevlarium Refinery';
const trackStart = {
    x: 6.567032814025879,
    y: -2725.9384765625,
    z: 6.01025390625
};

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:RefineKevlarium1',
    3,
    3,
    'to begin refining kevlarium.'
);
interaction.addBlip(365, 6, jobName, 'crafting');

alt.on('job:RefineKevlarium1', player => {
    if (!doesUserHaveTurfAccess(player)) {
        player.notify('You must own this turf to access this point.');
        return;
    }

    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'unrefinedkevlarium', hasItem: true }]);
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

    pos = { x: 12.97163200378418, y: -2802.373779296875, z: 2.5259501934051514 };
    obj = new Objective(objectives.HOLD, modifiers.ON_FOOT | modifiers.REMOVE_ITEM);
    obj.setHelpText('Hold ~INPUT_CONTEXT~ to wash the kevlarium seeds.');
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
    obj.setRewards([{ type: 'xp', prop: 'crafting', quantity: 5 }]);
    obj.setMaxProgress(5);
    // /tryparticle core water_splash_whale_wade 1000 1 0 1 0
    // /tryparticle core ent_dst_gen_water_spray 1000 1 0 1 0
    obj.setAnimationAndSound('missarmenian3_gardener', 'idle_a', 1, -1);
    // markanim anim@heists@load_box load_box_2
    obj.setParticleEffect([
        {
            dict: 'core',
            name: 'water_splash_whale_wade',
            duration: 500,
            scale: 2,
            offset: { x: 0, y: 1.2, z: -1 },
            time: 0.12 // Animation times to play at.
        },
        {
            dict: 'core',
            name: 'water_splash_whale_wade',
            duration: 500,
            scale: 2,
            offset: { x: 0, y: 1.2, z: -1 },
            time: 0.16 // Animation times to play at.
        },
        {
            dict: 'core',
            name: 'water_splash_whale_wade',
            duration: 500,
            scale: 2,
            offset: { x: 0, y: 1.2, z: -1 },
            time: 0.21 // Animation times to play at.
        },
        {
            dict: 'core',
            name: 'water_splash_whale_wade',
            duration: 500,
            scale: 2,
            offset: { x: 0, y: 1.2, z: -1 },
            time: 0.27 // Animation times to play at.
        }
    ]);
    obj.setRemoveItem([{ key: 'unrefinedkevlarium', quantity: 1 }]);
    job.add(copyObjective(obj));

    pos = {
        x: -22.773624420166016,
        y: -2698.24609375,
        z: 6.07763671875
    };
    obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
    obj.setHelpText('Refine the kevlarium by mashing ~INPUT_CONTEXT~.');
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
    obj.setRewards([{ type: 'xp', prop: 'crafting', quantity: 20 }]);
    obj.setMaxProgress(10);
    obj.setAnimationAndSound(
        'anim@amb@business@coc@coc_packing@',
        'operate_press_basicmould_v3_pressoperator',
        1,
        -1
    );
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
    job.add(copyObjective(obj));

    pos = {
        x: -84.85714721679688,
        y: -2662.47021484375,
        z: 6.060791015625
    };
    obj = new Objective(objectives.CAPTURE, modifiers.ON_FOOT);
    obj.setHelpText('Wait for your kevlarium to dry on the drying rack.');
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
        { type: 'item', prop: 'refinedkevlarium', quantity: 1 }
    ]);
    job.add(copyObjective(obj));

    job.start(player);
});
