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

const jobName = 'Mining';
const trackStart = { x: -600.37548828125, y: 2093.069580078125, z: 131.27413940429688 };
const trackPoints = [
    { x: -590.298095703125, y: 2060.36376953125, z: 130.7615966796875 },
    { x: -578.9600830078125, y: 2030.5670166015625, z: 128.4907684326172 },
    { x: -562.0599975585938, y: 2011.3909912109375, z: 127.28236389160156 },
    { x: -552.18408203125, y: 1995.560302734375, z: 127.05563354492188 },
    { x: -532.3329467773438, y: 1979.51416015625, z: 127.03955078125 },
    { x: -500.91485595703125, y: 1978.5411376953125, z: 125.93067169189453 },
    { x: -468.2342834472656, y: 1991.039794921875, z: 123.60984802246094 },
    { x: -446.1396179199219, y: 2014.3232421875, z: 123.7269287109375 },
    { x: -451.87054443359375, y: 2054.148681640625, z: 122.22423553466797 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:MiningShaft',
    3,
    3,
    'to begin mining for ore.'
);
interaction.addBlip(78, 6, jobName);

alt.on('job:MiningShaft', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'pickaxe', hasItem: true }]);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT | modifiers.REMOVE_ITEM);
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

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
        obj.setHelpText('Mine ore by mashing ~INPUT_CONTEXT~');
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
            { type: 'xp', prop: 'mining', quantity: 20 },
            { type: 'item', prop: 'unrefinedmetal', quantity: 2 }
        ]);
        obj.setMaxProgress(10);
        obj.setAnimationAndSound(
            'melee@large_wpn@streamed_core',
            'ground_attack_on_spot',
            1,
            -1,
            [{ name: 'dirt', time: 0.35 }]
        ); // markanim melee@large_wpn@streamed_core ground_attack_on_spot
        obj.setParticleEffect([
            {
                dict: 'core',
                name: 'ent_dst_rocks',
                duration: 50,
                scale: 1,
                offset: { x: 0, y: 0.8, z: -1 },
                time: 0.35 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_anim_dusty_hands',
                duration: 200,
                scale: 3.5,
                offset: { x: 0, y: -0.2, z: 1 },
                time: 0.65
            }
        ]);
        job.add(copyObjective(obj));
    });
    job.start(player);
});
