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
const trackStart = { x: 515.2205810546875, y: 5532.3662109375, z: 775.8995361328125 };
const trackPoints = [
    { x: 515.2205810546875, y: 5532.3662109375, z: 775.8995361328125 },
    { x: 534.713623046875, y: 5520.1845703125, z: 771.1924438476562 },
    { x: 546.5703125, y: 5502.8955078125, z: 757.335205078125 },
    { x: 562.6454467773438, y: 5494.63818359375, z: 741.5980834960938 },
    { x: 591.2870483398438, y: 5459.57861328125, z: 725.9287109375 },
    { x: 630.6014404296875, y: 5444.64697265625, z: 708.1992797851562 },
    { x: 640.0105590820312, y: 5413.048828125, z: 681.4417724609375 },
    { x: 671.8607177734375, y: 5392.54833984375, z: 656.7361450195312 },
    { x: 701.99072265625, y: 5380.38916015625, z: 621.1550903320312 },
    { x: 731.1183471679688, y: 5362.51416015625, z: 580.8819580078125 },
    { x: 787.5293579101562, y: 5324.69580078125, z: 473.2517395019531 },
    { x: 852.004638671875, y: 5297.9013671875, z: 386.0342102050781 },
    { x: 881.3130493164062, y: 5303.91015625, z: 370.5647277832031 },
    { x: 916.353515625, y: 5301.83642578125, z: 362.9815368652344 },
    { x: 960.9724731445312, y: 5292.9287109375, z: 347.2603759765625 },
    { x: 1003.4613037109375, y: 5267.66943359375, z: 321.7461853027344 },
    { x: 1041.880615234375, y: 5230.19482421875, z: 288.84735107421875 },
    { x: 1089.6781005859375, y: 5213.529296875, z: 268.1192626953125 },
    { x: 1144.1131591796875, y: 5196.92578125, z: 244.09490966796875 },
    { x: 1175.6466064453125, y: 5161.63818359375, z: 222.65847778320312 },
    { x: 1201.1171875, y: 5122.66064453125, z: 197.29405212402344 },
    { x: 1225.7728271484375, y: 5099.82763671875, z: 185.27488708496094 },
    { x: 1254.35302734375, y: 5056.935546875, z: 164.75039672851562 },
    { x: 1298.7255859375, y: 5039.1669921875, z: 150.69949340820312 },
    { x: 1342.2174072265625, y: 5038.47314453125, z: 135.73057556152344 },
    { x: 1362.046875, y: 4986.23681640625, z: 118.50753021240234 },
    { x: 1427.3507080078125, y: 4987.23193359375, z: 92.46479034423828 },
    { x: 1488.25439453125, y: 4942.83642578125, z: 73.97357177734375 },
    { x: 1551.6566162109375, y: 4946.70263671875, z: 65.42449188232422 },
    { x: 1601.852783203125, y: 4943.072265625, z: 45.59339141845703 },
    { x: 1644.2208251953125, y: 4938.0625, z: 41.53839874267578 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:MtnBike2',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(126, 6, jobName);

alt.on('job:MtnBike2', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your bike.');
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
    obj.setVehicle('scorcher', trackStart);
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
        obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 10 }]);
        job.add(copyObjective(obj));
    });

    let pos = { x: 1669.4530029296875, y: 4948.33740234375, z: 42.17937088012695 };
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
