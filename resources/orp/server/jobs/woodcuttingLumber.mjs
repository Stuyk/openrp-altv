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

const jobName = 'Lumberjacking';
const trackStart = { x: -528.0042724609375, y: 5379.05517578125, z: 70.3141098022461 };
const trackPoints = [
    { x: -561.2348022460938, y: 5419.4033203125, z: 62.256629943847656 },
    { x: -600.2713623046875, y: 5398.50634765625, z: 52.460350036621094 },
    { x: -613.843994140625, y: 5400.56201171875, z: 51.155635833740234 },
    { x: -615.3138427734375, y: 5423.8173828125, z: 50.892066955566406 },
    { x: -615.08154296875, y: 5433.75244140625, z: 53.53422164916992 },
    { x: -620.4341430664062, y: 5429.06884765625, z: 52.544097900390625 },
    { x: -595.2300415039062, y: 5452.47216796875, z: 59.3484992980957 },
    { x: -581.6073608398438, y: 5471.39892578125, z: 59.39268493652344 },
    { x: -561.0091552734375, y: 5461.55859375, z: 63.26083755493164 },
    { x: -552.0471801757812, y: 5446.66552734375, z: 64.1369400024414 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:LumberJack',
    3,
    3,
    'to begin cutting wood.'
);
interaction.addBlip(77, 6, jobName, 'woodcutting');

alt.on('job:LumberJack', player => {
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    job.setItemRestrictions([{ key: 'axe', hasItem: true }]);

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
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
        obj.setHelpText('Cut wood by mashing ~INPUT_CONTEXT~');
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
            { type: 'xp', prop: 'woodcutting', quantity: 20 },
            { type: 'item', prop: 'unrefinedwood', quantity: 1 }
        ]);
        obj.setMaxProgress(10);
        obj.setAnimationAndSound(
            'melee@large_wpn@streamed_core',
            'car_side_attack_a',
            1,
            -1,
            [{ name: 'chop', time: 0.21 }]
        );
        obj.setParticleEffect([
            {
                dict: 'core',
                name: 'ent_dst_wood_splinter',
                duration: 25,
                scale: 0.8,
                offset: { x: 0, y: 1, z: 0 },
                time: 0.2
            }
        ]);
        job.add(copyObjective(obj));
    });

    job.start(player);
});
