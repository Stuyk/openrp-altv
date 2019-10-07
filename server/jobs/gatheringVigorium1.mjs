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

const jobName = 'Vigorium Fields';
const trackStart = {
    x: 2020.4307861328125,
    y: 4832.45263671875,
    z: 41.4791259765625
};
const minLoop = 10;
const trackPoints = [
    {
        x: 2006.3472900390625,
        y: 4831.384765625,
        z: 42.99560546875
    },
    {
        x: 1992.25048828125,
        y: 4845.9560546875,
        z: 43.972900390625
    },
    {
        x: 1980.883544921875,
        y: 4841.11669921875,
        z: 43.939208984375
    },
    {
        x: 1998.4088134765625,
        y: 4823.09033203125,
        z: 43.13037109375
    },
    {
        x: 2002.879150390625,
        y: 4818.580078125,
        z: 42.6922607421875
    },
    {
        x: 1996.5362548828125,
        y: 4815.2177734375,
        z: 42.89453125
    },
    {
        x: 1992.6461181640625,
        y: 4819.23974609375,
        z: 43.3494873046875
    },
    {
        x: 1979.037353515625,
        y: 4833.17822265625,
        z: 44.040283203125
    },
    {
        x: 1974.949462890625,
        y: 4837.1474609375,
        z: 44.0908203125
    },
    {
        x: 1969.7010498046875,
        y: 4832.861328125,
        z: 44.040283203125
    },
    {
        x: 1974.2506103515625,
        y: 4828.07470703125,
        z: 43.8212890625
    },
    {
        x: 1988.17578125,
        y: 4813.701171875,
        z: 43.180908203125
    },
    {
        x: 1992.4615478515625,
        y: 4809.40234375,
        z: 42.7259521484375
    },
    {
        x: 1987.5032958984375,
        y: 4804.36474609375,
        z: 42.6754150390625
    },
    {
        x: 1983.3231201171875,
        y: 4808.58447265625,
        z: 42.9619140625
    },
    {
        x: 1970.2021484375,
        y: 4822.41748046875,
        z: 43.6695556640625
    },
    {
        x: 1965.230712890625,
        y: 4827.36279296875,
        z: 43.9560546875
    },
    {
        x: 1932.4747314453125,
        y: 4828.6943359375,
        z: 45.5399169921875
    },
    {
        x: 1927.068115234375,
        y: 4834.04833984375,
        z: 46.129638671875
    },
    {
        x: 1911.982421875,
        y: 4848.8173828125,
        z: 46.989013671875
    },
    {
        x: 1907.9208984375,
        y: 4852.76025390625,
        z: 46.887939453125
    },
    {
        x: 1898.993408203125,
        y: 4861.63525390625,
        z: 46.6182861328125
    },
    {
        x: 1894.931884765625,
        y: 4865.7099609375,
        z: 46.3656005859375
    },
    {
        x: 1887.4813232421875,
        y: 4859.0244140625,
        z: 45.6072998046875
    },
    {
        x: 1902.764892578125,
        y: 4843.95166015625,
        z: 46.4161376953125
    },
    {
        x: 1891.4373779296875,
        y: 4845.75830078125,
        z: 45.91064453125
    },
    {
        x: 1906.931884765625,
        y: 4827.982421875,
        z: 45.6578369140625
    }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:GatheringVigorium1',
    3,
    3,
    'to begin gathering unrefined vigorium.'
);
interaction.addBlip(140, 6, jobName);

alt.on('job:GatheringVigorium1', player => {
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    let pos;
    const indexes = [];
    for (let i = 0; i < minLoop; i++) {
        indexes.push(Math.floor(Math.random() * (trackPoints.length - 1)));
    }

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

    pos = {
        x: 2006.3472900390625,
        y: 4831.384765625,
        z: 42.99560546875
    };
    obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Walk over to the bush.');
    obj.setBlip(367, 2, pos);
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
    job.add(copyObjective(obj));

    obj = new Objective(objectives.MINIGAME, modifiers.ON_FOOT);
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setBlip(367, 2, pos);
    obj.setMiniGame('FindInDirt');
    obj.setAnimationAndSound('missarmenian3_gardener', 'idle_a', 1, -1);
    obj.setParticleEffect([
        {
            dict: 'core',
            name: 'ent_anim_dusty_hands',
            duration: 20,
            scale: 2.0,
            offset: { x: 0, y: 0.4, z: -1 },
            time: 0.14 // Animation times to play at.
        },
        {
            dict: 'core',
            name: 'ent_anim_dusty_hands',
            duration: 20,
            scale: 2.0,
            offset: { x: 0, y: 0.4, z: -1 },
            time: 0.17 // Animation times to play at.
        }
    ]);
    obj.setRewards([
        { type: 'xp', prop: 'gathering', quantity: 20 },
        { type: 'item', prop: 'unrefinedvigorium', quantity: 1 }
    ]);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    indexes.forEach(index => {
        const pos = trackPoints[index];

        obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
        obj.setHelpText('Walk over to the bush.');
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
        job.add(copyObjective(obj));

        obj = new Objective(objectives.MINIGAME, modifiers.ON_FOOT);
        obj.setPosition(pos);
        obj.setRange(3);
        obj.setBlip(367, 2, pos);
        obj.setMiniGame('FindInDirt');
        obj.setAnimationAndSound('missarmenian3_gardener', 'idle_a', 1, -1);
        obj.setParticleEffect([
            {
                dict: 'core',
                name: 'ent_anim_dusty_hands',
                duration: 20,
                scale: 2.0,
                offset: { x: 0, y: 0.4, z: -1 },
                time: 0.14 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_anim_dusty_hands',
                duration: 20,
                scale: 2.0,
                offset: { x: 0, y: 0.4, z: -1 },
                time: 0.17 // Animation times to play at.
            }
        ]);
        obj.setRewards([
            { type: 'xp', prop: 'gathering', quantity: 20 },
            { type: 'item', prop: 'unrefinedvigorium', quantity: 1 }
        ]);
        job.add(copyObjective(obj));
    });

    job.start(player);
});
