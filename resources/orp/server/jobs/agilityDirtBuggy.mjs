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

const jobName = 'Agility Training';
const trackStart = { x: -2194.39111328125, y: -419.4593505859375, z: 13.087158203125 };
const trackPoints = [
    { x: -2231.485595703125, y: -388.1406555175781, z: 6.886474609375 },
    { x: -2241.138427734375, y: -366.962646484375, z: 12.7164306640625 },
    { x: -2261.98681640625, y: -358.5230712890625, z: 12.7332763671875 },
    { x: -2298.43505859375, y: -364.3648376464844, z: 5.235107421875 },
    { x: -2317.7802734375, y: -348.1714172363281, z: 6.2967529296875 },
    { x: -2329.015380859375, y: -330.8439636230469, z: 11.958251953125 },
    { x: -2341.292236328125, y: -317.6439514160156, z: 13.3568115234375 },
    { x: -2356.865966796875, y: -322.78680419921875, z: 6.111328125 },
    { x: -2383.8330078125, y: -315.28350830078125, z: 5.3531494140625 },
    { x: -2380.1669921875, y: -289.6351623535156, z: 14.16552734375 },
    { x: -2405.88134765625, y: -284.69012451171875, z: 12.1435546875 },
    { x: -2428.193359375, y: -273.73187255859375, z: 11.233642578125 },
    { x: -2448.0791015625, y: -261.19122314453125, z: 12.7332763671875 },
    { x: -2464.087890625, y: -252.44834899902344, z: 15.5640869140625 },
    { x: -2472.896728515625, y: -236.37362670898438, z: 16.9794921875 },
    { x: -2484.263671875, y: -238.93186950683594, z: 15.176513671875 },
    { x: -2504.50537109375, y: -239.28790283203125, z: 11.08203125 },
    { x: -2507.261474609375, y: -224.3340606689453, z: 16.8447265625 },
    { x: -2526.48779296875, y: -211.74066162109375, z: 18.4454345703125 },
    { x: -2539.147216796875, y: -221.5384521484375, z: 9.3128662109375 },
    { x: -2563.63525390625, y: -202.8131866455078, z: 11.90771484375 },
    { x: -2591.314208984375, y: -174.5142822265625, z: 16.204345703125 },
    { x: -2608.655029296875, y: -168.06593322753906, z: 14.6878662109375 },
    { x: -2631.9560546875, y: -150.8043975830078, z: 14.3341064453125 },
    { x: -2654.782470703125, y: -144.61978149414062, z: 7.880615234375 },
    { x: -2664.712158203125, y: -154.8131866455078, z: 4.02197265625 },
    { x: -2614.694580078125, y: -210.27691650390625, z: 2.4044189453125 },
    { x: -2513.050537109375, y: -270.8835144042969, z: 2.7919921875 },
    { x: -2433.99560546875, y: -307.80657958984375, z: 4.3758544921875 },
    { x: -2342.0439453125, y: -354.80438232421875, z: 2.977294921875 },
    { x: -2276.17578125, y: -402.5010986328125, z: 1.915771484375 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:DirtBuggy',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(126, 6, jobName, 'agility');

alt.on('job:DirtBuggy', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your dirtbuggy.');
    obj.setBlip(1, 1, trackStart);
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
    obj.setVehicle('bifta', trackStart);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
        obj.setHelpText('Follow the course between the rocks.');
        obj.setPosition(pos);
        obj.setBlip(1, 2, pos);
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
        obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 5 }]);
        job.add(copyObjective(obj));
    });

    let pos = { x: -2222.756103515625, y: -427.21319580078125, z: 2.5391845703125 };
    obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
    obj.setHelpText('Finish the course.');
    obj.setPosition(pos);
    obj.setBlip(1, 2, pos);
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
    obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 10 }]);
    job.add(copyObjective(obj));

    job.start(player);
});
