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

const jobName = 'Lumber Refinery';
const trackStart = { x: -528.0512084960938, y: 5298.38525390625, z: 74.17427062988281 };

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:LumberRefinery',
    3,
    3,
    'to begin the refinery process.'
);
interaction.addBlip(657, 6, jobName);

alt.on('job:LumberRefinery', player => {
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    job.setItemRestrictions([{ label: 'Unrefined Wood', hasItem: true }]);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
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
    /*
    obj.setProps([
        {
            name: 'prop_welding_mask_01',
            bone: 12844,
            x: 0.11,
            y: 0.01,
            z: 0,
            pitch: 180,
            roll: 270,
            yaw: 0
        }
    ]);
    */
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    let pos = { x: -522.7107543945312, y: 5289.708984375, z: 73.67436981201172 };
    obj = new Objective(objectives.HOLD, modifiers.ON_FOOT | modifiers.REMOVE_ITEM);
    obj.setHelpText('Hold ~INPUT_CONTEXT~ to pickup some planks.');
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
    obj.setRewards([{ type: 'xp', prop: 'woodcutting', quantity: 5 }]);
    obj.setMaxProgress(5);
    obj.setAnimationAndSound(
        'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
        'weed_crouch_checkingleaves_idle_01_inspector',
        1,
        -1
    );
    obj.setProps([
        {
            name: 'prop_rub_planks_01',
            bone: 57005,
            x: 0.1,
            y: 0.04,
            z: -0.22,
            pitch: -5,
            roll: 0,
            yaw: 20
        }
    ]);
    obj.setRemoveItem([{ label: 'Unrefined Wood', quantity: 1 }]);
    job.add(copyObjective(obj));

    // Walk to Point
    pos = { x: -532.4095458984375, y: 5292.8291015625, z: 73.69466400146484 };
    obj = new Objective(objectives.POINT, modifiers.ON_FOOT | modifiers.CLEAR_PROPS);
    obj.setHelpText('Walk over to the saw.');
    obj.setPosition(pos);
    obj.setBlip(367, 2, pos);
    obj.setRange(1);
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
    obj.setForcedAnim('anim@heists@load_box', 'idle', 50);
    job.add(copyObjective(obj));

    //[{name: 'prop_fncwood_14a', bone: 57005, x: 0, y: 0, z: 0, pitch: 0, roll: 0, yaw: 0}]
    pos = { x: -532.4095458984375, y: 5292.8291015625, z: 73.69466400146484 };
    obj = new Objective(objectives.MASH, modifiers.ON_FOOT | modifiers.REMOVE_ITEM);
    obj.setHelpText('Mash ~INPUT_CONTEXT~ to saw through the wood.');
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
        { type: 'xp', prop: 'woodcutting', quantity: 15 },
        { type: 'item', prop: 'RefinedWood', quantity: 2 }
    ]);
    obj.setMaxProgress(10);
    obj.setAnimationAndSound('mp_safehousevagos@', 'package_dropoff', 1, -1, [
        { name: 'woodcut', time: 0.3 }
    ]);
    obj.setParticleEffect([
        {
            dict: 'core',
            name: 'bang_wood',
            duration: 200,
            scale: 1,
            offset: { x: 0, y: 1, z: 0 },
            time: 0.4 // Animation times to play at.
        },
        {
            dict: 'core',
            name: 'ent_anim_dusty_hands',
            duration: 400,
            scale: 2,
            offset: { x: 0, y: 1, z: 0.5 },
            time: 0.45 // Animation times to play at.
        }
    ]);
    job.add(copyObjective(obj));
    // markanim mp_safehousevagos@ package_dropoff
    job.start(player);
});

// markanim amb@world_human_welding@male@idle_a idle_a
