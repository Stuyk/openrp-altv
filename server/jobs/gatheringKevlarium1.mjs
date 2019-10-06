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
const minLoop = 10;
const trackPoints = [
    {
        x: -1888.2989501953125,
        y: 2164.575927734375,
        z: 114.759033203125
    },
    {
        x: -1880.18896484375,
        y: 2168.13623046875,
        z: 114.91064453125
    },
    {
        x: -1870.04833984375,
        y: 2167.226318359375,
        z: 115.9384765625
    },
    {
        x: -1860.830810546875,
        y: 2162.0966796875,
        z: 117.03369140625
    },
    {
        x: -1870.3516845703125,
        y: 2162.861572265625,
        z: 117.4381103515625
    },
    {
        x: -1880.03076171875,
        y: 2163.67919921875,
        z: 116.3428955078125
    },
    {
        x: -1888.4044189453125,
        y: 2164.628662109375,
        z: 114.7252197265625
    },
    {
        x: -1893.6131591796875,
        y: 2160.2900390625,
        z: 115.6351318359375
    },
    {
        x: -1881.072509765625,
        y: 2159.142822265625,
        z: 118.02783203125
    },
    {
        x: -1869.5472412109375,
        y: 2158.3779296875,
        z: 119.038818359375
    },
    {
        x: -1857.6263427734375,
        y: 2157.112060546875,
        z: 118.213134765625
    },
    {
        x: -1848.22412109375,
        y: 2156.47900390625,
        z: 116.6461181640625
    },
    {
        x: -1845.177978515625,
        y: 2151.57373046875,
        z: 117.842529296875
    },
    {
        x: -1853.5252685546875,
        y: 2152.28564453125,
        z: 119.123046875
    },
    {
        x: -1865.90771484375,
        y: 2153.366943359375,
        z: 120.3699951171875
    },
    {
        x: -1879.96484375,
        y: 2154.857177734375,
        z: 119.6790771484375
    },
    {
        x: -1890.6724853515625,
        y: 2155.6220703125,
        z: 117.7244873046875
    },
    {
        x: -1899.059326171875,
        y: 2156.26806640625,
        z: 115.6014404296875
    },
    {
        x: -1902.883544921875,
        y: 2152.1142578125,
        z: 116.022705078125
    },
    {
        x: -1890.6593017578125,
        y: 2150.769287109375,
        z: 119.6959228515625
    },
    {
        x: -1881.96923828125,
        y: 2150.26806640625,
        z: 121.128173828125
    },
    {
        x: -1875.125244140625,
        y: 2149.595703125,
        z: 121.953857421875
    },
    {
        x: -1866.22412109375,
        y: 2148.909912109375,
        z: 121.970703125
    },
    {
        x: -1846.02197265625,
        y: 2147.076904296875,
        z: 119.6790771484375
    },
    {
        x: -1844.17578125,
        y: 2142.3955078125,
        z: 121.3304443359375
    },
    {
        x: -1851.7318115234375,
        y: 2143.107666015625,
        z: 122.5098876953125
    },
    {
        x: -1864.971435546875,
        y: 2144.16259765625,
        z: 123.4029541015625
    },
    {
        x: -1879.806640625,
        y: 2145.177978515625,
        z: 123.183837890625
    },
    {
        x: -1890.0791015625,
        y: 2146.28564453125,
        z: 121.3809814453125
    },
    {
        x: -1898.3341064453125,
        y: 2147.024169921875,
        z: 119.1904296875
    },
    {
        x: -1906.6680908203125,
        y: 2147.67041015625,
        z: 116.3092041015625
    },
    {
        x: -1907.4593505859375,
        y: 2143.424072265625,
        z: 117.5223388671875
    },
    {
        x: -1900.3648681640625,
        y: 2142.830810546875,
        z: 120.1845703125
    },
    {
        x: -1892.0966796875,
        y: 2142.0263671875,
        z: 122.5098876953125
    },
    {
        x: -1881.7449951171875,
        y: 2141.116455078125,
        z: 124.4981689453125
    },
    {
        x: -1869.3231201171875,
        y: 2140.2197265625,
        z: 125.172119140625
    },
    {
        x: -1857.006591796875,
        y: 2138.980224609375,
        z: 124.6329345703125
    },
    {
        x: -1847.3143310546875,
        y: 2138.18896484375,
        z: 123.841064453125
    },
    {
        x: -1847.050537109375,
        y: 2133.6923828125,
        z: 125.6102294921875
    },
    {
        x: -1859.024169921875,
        y: 2134.773681640625,
        z: 126.3516845703125
    },
    {
        x: -1876.918701171875,
        y: 2136.22412109375,
        z: 126.5875244140625
    },
    {
        x: -1890.4351806640625,
        y: 2137.041748046875,
        z: 124.7003173828125
    },
    {
        x: -1901.090087890625,
        y: 2138.228515625,
        z: 121.751708984375
    }
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

    pos = { x: -1879.8240966796875, y: 2163.6552734375, z: 116.38874053955078 };
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
    obj.setMiniGame('FindInLeaves');
    obj.setAnimationAndSound(
        'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
        'weed_stand_checkingleaves_idle_01_inspector',
        1,
        -1
    );
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
    obj.setRewards([
        { type: 'xp', prop: 'gathering', quantity: 20 },
        { type: 'item', prop: 'unrefinedkevlarium', quantity: 1 }
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
        obj.setMiniGame('FindInLeaves');
        obj.setAnimationAndSound(
            'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
            'weed_stand_checkingleaves_idle_01_inspector',
            1,
            -1
        );
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
        obj.setRewards([
            { type: 'xp', prop: 'gathering', quantity: 20 },
            { type: 'item', prop: 'unrefinedkevlarium', quantity: 1 }
        ]);
        job.add(copyObjective(obj));
    });

    job.start(player);
});
