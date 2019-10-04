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

const jobName = 'Kevlarium Fields';
const trackStart = {
    x: -1911.2142333984375,
    y: 2158.582763671875,
    z: 111.71373748779297
};
const trackPoints = [
    { x: -1879.8240966796875, y: 2163.6552734375, z: 116.38874053955078 },
    { x: -1869.9156494140625, y: 2162.826171875, z: 117.49504089355469 },
    { x: -1859.6766357421875, y: 2162.2119140625, z: 116.83358001708984 },
    { x: -1844.5614013671875, y: 2151.544189453125, z: 117.71281433105469 },
    { x: -1863.7867431640625, y: 2153.16064453125, z: 120.20663452148438 },
    { x: -1879.3912353515625, y: 2154.77099609375, z: 119.77362060546875 },
    { x: -1898.5352783203125, y: 2156.203125, z: 115.77120208740234 },
    { x: -1903.101806640625, y: 2152.142578125, z: 115.94483947753906 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:GatheringKevlarium1',
    3,
    3,
    'to begin gathering unrefined kevlarium.'
);
interaction.addBlip(140, 6, jobName);

alt.on('job:GatheringKevlarium1', player => {
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );

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

    obj = new Objective(objectives.ORDER, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(5);
    obj.setHelpText('Press the keys in order.');
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

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.HOLD, modifiers.ON_FOOT);
        obj.setHelpText('Hold ~INPUT_CONTEXT~ to gather.');
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
            { type: 'xp', prop: 'gathering', quantity: 20 },
            { type: 'item', prop: 'unrefinedkevlarium', quantity: 1 }
        ]);
        obj.setMaxProgress(10);
        obj.setAnimationAndSound(
            'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
            'weed_stand_checkingleaves_idle_01_inspector',
            1,
            -1
        );
        // core ent_dst_rocks 20 1 0 0.8 -1
        obj.setParticleEffect([
            {
                dict: 'core',
                name: 'ent_col_bush_leaves',
                duration: 20,
                scale: 0.5,
                offset: { x: 0, y: 0.8, z: 0 },
                time: 0.14 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_col_bush_leaves',
                duration: 20,
                scale: 0.5,
                offset: { x: 0, y: 0.8, z: 0 },
                time: 0.47 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_col_bush_leaves',
                duration: 20,
                scale: 0.5,
                offset: { x: 0, y: 0.8, z: 0 },
                time: 0.69 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_col_bush_leaves',
                duration: 20,
                scale: 0.5,
                offset: { x: 0, y: 0.8, z: 0 },
                time: 0.8 // Animation times to play at.
            }
        ]);
        job.add(copyObjective(obj));
        // markanim anim@amb@business@weed@weed_inspecting_lo_med_hi@ weed_stand_checkingleaves_idle_01_inspector
    });

    job.start(player);
});
