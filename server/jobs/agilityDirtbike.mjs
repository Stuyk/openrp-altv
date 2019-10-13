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
const trackStart = { x: -1186.2593994140625, y: 3856.404296875, z: 489.987548828125 };
const trackPoints = [
    { x: -1186.2593994140625, y: 3856.404296875, z: 489.987548828125 },
    { x: -1171.4110107421875, y: 3846.936279296875, z: 487.308349609375 },
    { x: -1155.217529296875, y: 3837.83740234375, z: 482.034423828125 },
    { x: -1075.6351318359375, y: 3828.883544921875, z: 446.06005859375 },
    { x: -1010.1626586914062, y: 3829.912109375, z: 430.271728515625 },
    { x: -961.3978271484375, y: 3789.481201171875, z: 417.213134765625 },
    { x: -974.4527587890625, y: 3737.77587890625, z: 399.841064453125 },
    { x: -970.931884765625, y: 3677.6044921875, z: 379.08203125 },
    { x: -945.112060546875, y: 3636.2900390625, z: 353.20068359375 },
    { x: -935.90771484375, y: 3576.3427734375, z: 311.750244140625 },
    { x: -931.5428466796875, y: 3522.32958984375, z: 288.3458251953125 },
    { x: -934.1670532226562, y: 3451.397705078125, z: 261.06591796875 },
    { x: -943.3978271484375, y: 3391.015380859375, z: 241.7222900390625 },
    { x: -934.04833984375, y: 3337.160400390625, z: 214.07177734375 },
    { x: -908.0703125, y: 3301.912109375, z: 199.4124755859375 },
    { x: -871.015380859375, y: 3279.283447265625, z: 180.92822265625 },
    { x: -837.94287109375, y: 3256.12744140625, z: 162.2755126953125 },
    { x: -807.91650390625, y: 3229.028564453125, z: 154.238037109375 },
    { x: -786.5538330078125, y: 3196.298828125, z: 133.4285888671875 },
    { x: -752.6109619140625, y: 3154.707763671875, z: 113.6973876953125 },
    { x: -723.8109741210938, y: 3114.712158203125, z: 95.904052734375 },
    { x: -732.3824462890625, y: 3085.371337890625, z: 85.3055419921875 },
    { x: -730.7736206054688, y: 3032.716552734375, z: 60.5194091796875 },
    { x: -728.7560424804688, y: 3022.945068359375, z: 51.6900634765625 },
    { x: -725.93408203125, y: 3010.39111328125, z: 43.5179443359375 },
    { x: -717.7846069335938, y: 2955.7978515625, z: 25.4381103515625 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:Dirtbike',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(126, 6, jobName);

alt.on('job:Dirtbike', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your dirtbike.');
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
    obj.setVehicle('manchez', trackStart);
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

    let pos = { x: -717.7846069335938, y: 2955.7978515625, z: 25.4381103515625 };
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
