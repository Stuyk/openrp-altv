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
const trackStart = { x: -682.4571533203125, y: 2923.806640625, z: 13.89599609375 };
const trackPoints = [
    { x: -690.6197509765625, y: 2898.685791015625, z: 14.013916015625 },
    { x: -710.874755859375, y: 2882.980224609375, z: 13.980224609375 },
    { x: -753.1516723632812, y: 2859.059326171875, z: 13.9970703125 },
    { x: -791.1428833007812, y: 2834.742919921875, z: 11.065185546875 },
    { x: -827.4593505859375, y: 2815.66162109375, z: 10.4417724609375 },
    { x: -910.2197875976562, y: 2808.40869140625, z: 10.4754638671875 },
    { x: -981.8505249023438, y: 2820.1318359375, z: 7.156005859375 },
    { x: -1048.3648681640625, y: 2827.68798828125, z: 4.94873046875 },
    { x: -1123.8330078125, y: 2797.5693359375, z: 0.4835205078125 },
    { x: -1216.6417236328125, y: 2701.252685546875, z: 0.921630859375 },
    { x: -1376.4263916015625, y: 2641.384521484375, z: 0.786865234375 },
    { x: -1524.2901611328125, y: 2639.69677734375, z: 0.753173828125 },
    { x: -1609.213134765625, y: 2629.107666015625, z: 0.753173828125 },
    { x: -1673.3275146484375, y: 2602.404296875, z: 0.77001953125 },
    { x: -1720.0615234375, y: 2598.25048828125, z: 0.753173828125 },
    { x: -1767.112060546875, y: 2605.63525390625, z: 0.753173828125 },
    { x: -1821.4813232421875, y: 2591.64404296875, z: 0.753173828125 },
    { x: -1926.17138671875, y: 2571.982421875, z: 0.77001953125 },
    { x: -1973.103271484375, y: 2554.12744140625, z: 0.77001953125 },
    { x: -2043.8505859375, y: 2558.333984375, z: 0.7193603515625 },
    { x: -2128.23291015625, y: 2591.195556640625, z: 0.753173828125 },
    { x: -2204.017578125, y: 2597.182373046875, z: 0.77001953125 },
    { x: -2266.707763671875, y: 2595.876953125, z: 0.77001953125 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:WaterScooter',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(126, 6, jobName);

alt.on('job:WaterScooter', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your waterscooter.');
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
    obj.setVehicle('seashark3', trackStart);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
        obj.setHelpText('Follow the course down.');
        obj.setPosition(pos);
        obj.setRange(3);
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

    let pos = { x: -2298.38232421875, y: 2565.78466796875, z: 0.3992919921875 };
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
