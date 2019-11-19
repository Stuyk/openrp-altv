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

const jobName = 'Smeltery';
const trackStart = { x: 1080.951171875, y: -1995.028076171875, z: 30.987693786621094 };
const trackPoints = [
    { x: 1084.63134765625, y: -1991.0196533203125, z: 29.6242618560791 },
    { x: 1096.5064697265625, y: -1994.29638671875, z: 29.37691879272461 },
    { x: 1102.3404541015625, y: -2004.3143310546875, z: 29.43343734741211 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:SmithingRefinery',
    3,
    3,
    'to begin the refinery process.'
);
interaction.addBlip(648, 6, jobName, 'crafting');

alt.on('job:SmithingRefinery', player => {
    if (!player.equipment[11]) {
        player.notify('Must have a hammer equipped.');
        player.playAudio('error');
        return;
    }

    if (player.equipment[11].base !== 'hammer') {
        player.notify('Must have a hammer equipped.');
        player.playAudio('error');
        return;
    }

    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    job.setItemRestrictions([
        { key: 'unrefinedmetal', hasItem: true },
        { key: 'hammer', hasItem: true }
    ]);

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
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    let pos = { x: 1084.591552734375, y: -2002.2899169921875, z: 31.398618698120117 };
    obj = new Objective(objectives.HOLD, modifiers.ON_FOOT | modifiers.REMOVE_ITEM);
    obj.setHelpText('Hold ~INPUT_CONTEXT~ to load ore into the hopper.');
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
    obj.setRewards([{ type: 'xp', prop: 'smithing', quantity: 5 }]);
    obj.setMaxProgress(5);
    obj.setAnimationAndSound('anim@heists@load_box', 'load_box_2', 1, -1, [
        { name: 'incinerate', time: 0.38 }
    ]);
    // markanim anim@heists@load_box load_box_2
    obj.setParticleEffect([
        {
            dict: 'core',
            name: 'fire_wrecked_train',
            duration: 800,
            scale: 1,
            offset: { x: 0, y: 1.2, z: 0.5 },
            time: 0.38 // Animation times to play at.
        }
    ]);
    obj.setRemoveItem([{ key: 'unrefinedmetal', quantity: 1 }]);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
        obj.setHelpText('Refine metal by mashing ~INPUT_CONTEXT~');
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
            { type: 'xp', prop: 'smithing', quantity: 20 },
            { type: 'item', prop: 'refinedmetal', quantity: 1 }
        ]);
        obj.setMaxProgress(10);
        obj.setAnimationAndSound('amb@world_human_hammering@male@base', 'base', 1, -1);
        obj.setParticleEffect([
            {
                dict: 'core',
                name: 'ent_brk_metal_frag',
                duration: 100,
                scale: 1,
                offset: { x: 0.2, y: 0.5, z: 0.8 },
                time: 0.06 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_brk_metal_frag',
                duration: 100,
                scale: 1,
                offset: { x: 0.2, y: 0.5, z: 0.8 },
                time: 0.23 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_brk_metal_frag',
                duration: 100,
                scale: 1,
                offset: { x: 0.2, y: 0.5, z: 0.8 },
                time: 0.4 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_brk_metal_frag',
                duration: 100,
                scale: 1,
                offset: { x: 0.2, y: 0.5, z: 0.8 },
                time: 0.55 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_brk_metal_frag',
                duration: 100,
                scale: 1,
                offset: { x: 0.2, y: 0.5, z: 0.8 },
                time: 0.71 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_brk_metal_frag',
                duration: 100,
                scale: 1,
                offset: { x: 0.2, y: 0.5, z: 0.8 },
                time: 0.87 // Animation times to play at.
            }
        ]);
        job.add(copyObjective(obj));
        // markanim amb@world_human_hammering@male@base base
    });

    job.start(player);
});

// markanim amb@world_human_welding@male@idle_a idle_a
/*
let cooldown = Date.now();
let interval = alt.setInterval(() => {
    if (
        Date.now() > cooldown &&
        game.isEntityInWater(alt.Player.local.scriptID) &&
        !game.isPedSwimming(alt.Player.local.scriptID)
    ) {
        cooldown = Date.now() + 500;
        alt.log(`This is probably water...`);
    }
}, 0);

alt.setTimeout(() => {
    alt.clearInterval(interval);
}, 5000);
*/
