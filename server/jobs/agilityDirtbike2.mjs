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

const jobName = 'Motorcross Training';
const trackStart = { "x": 1180.7962646484375, "y": 2373.35595703125, "z": 57.449951171875 };
const trackPoints = [
    { "x": 1164.666748046875, "y": 2439.90234375, "z": 55.575157165527344 },
    { "x":1131.8624267578125, "y":2479.818115234375, "z":52.5234489440918},
    { "x": 1091.70703125, "y": 2453.2314453125, "z": 49.49425506591797 },
    { "x": 1026.4510498046875, "y": 2439.0205078125, "z": 44.885108947753906 },
    { "x": 973.6740112304688, "y": 2459.2451171875, "z": 50.46562957763672 },
    { "x": 918.0927124023438, "y": 2485.292236328125, "z": 51.5704231262207 },
    { "x": 890.6107177734375, "y": 2415.194091796875, "z": 49.68352127075195 },
    { "x": 872.0709838867188, "y": 2333.06103515625, "z": 51.421791076660156 },
    { "x": 910.4046630859375, "y": 2262.681640625, "z": 45.745643615722656 },
    { "x": 1005.4283447265625, "y": 2189.629638671875, "z": 46.22898483276367 },
    { "x": 1138.7275390625, "y": 2154.6298828125, "z": 53.256309509277344 },
    { "x": 1111.9329833984375, "y": 2249.95947265625, "z": 49.35603332519531 },
    { "x": 1004.49462890625, "y": 2257.969970703125, "z": 46.766143798828125 },
    { "x": 1014.62890625, "y": 2407.0029296875, "z": 52.79118347167969 },
    { "x": 1097.4552001953125, "y": 2431.3310546875, "z": 50.08832931518555 },
    { "x": 1137.1396484375, "y": 2376.623779296875, "z": 50.06135940551758 },
    { "x": 1165.9403076171875, "y": 2319.921142578125, "z": 56.84038543701172 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:Dirtbike2',
    3,
    3,
    'to begin motorcross training.'
);
interaction.addBlip(226, 6, jobName);

alt.on('job:Dirtbike2', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your dirtbike.');
    obj.setBlip(255, 1, trackStart);
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
    obj.setVehicle('sanchez2', trackStart);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
        obj.setHelpText('Follow the course down.');
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
        obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 1 }]);
        job.add(copyObjective(obj));
    });

    let pos = { "x": 1165.499267578125, "y": 2359.8271484375, "z": 57.618446350097656 };
    obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
    obj.setHelpText('Finish the course.');
    obj.setPosition(pos);
    obj.setBlip(1, 2, pos);
    obj.setMarker(
        5, // finish line
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

    job.setElapsedTimer();
    job.start(player);
});
