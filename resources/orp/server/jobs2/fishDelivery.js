import * as alt from 'alt';
import { Interaction } from '../systems/interaction.js';
import { Job, Objectives, ObjectiveFlags } from '../systems/job2.js';
import { PedStream } from '../systems/pedstream.js';
import { distance } from '../utility/vector.js';

const jobIdentifier = 'job:FishDelivery1';
alt.onClient(jobIdentifier, startJob);
alt.on('job:Complete', completedJob);
alt.on('job:ObjectiveComplete', completedObjective);

const positions = [
    {
        x: 1176.5142822265625,
        y: -3215.736328125,
        z: 5.791259765625
    },
    {
        x: 727.2527465820312,
        y: -2055.6923828125,
        z: 29.3304443359375
    },
    {
        x: -660.962646484375,
        y: -954.3956298828125,
        z: 21.3941650390625
    },
    {
        x: -1598.3736572265625,
        y: -940.7472534179688,
        z: 13.6768798828125
    }
];

const startPoint = { x: 1181.7056884765625, y: -3179.050537109375, z: 6.028035640716553 };
const pedStream = new PedStream('s_m_y_construct_02', startPoint, 87.63, 'Fish Delivery');
pedStream.addInteraction({
    name: 'Start Work',
    isServer: true,
    eventName: jobIdentifier,
    data: {}
});

function startJob(player) {
    if (distance(player.pos, startPoint) >= 5) {
        return;
    }

    const objectives = [];
    const getVehicle = new Objectives.AddVehicle(
        { x: 1179.201416015625, y: -3200.302001953125, z: 6.0280351638793945 },
        3,
        'addvehicle',
        'Mule',
        0
    );
    getVehicle.setOptions({ description: 'Grab your delivery vehicle.' });
    objectives.push(getVehicle);

    const getFood = new Objectives.Point(
        {
            x: 1233.514892578125,
            y: -3228.19482421875,
            z: 5.852362155914307
        },
        3,
        'pickup:fish'
    );
    getFood.setModifierFlags(
        ObjectiveFlags.IS_CAPTURE | ObjectiveFlags.IS_IN_JOB_VEHICLE
    );
    getFood.setOptions({
        maxProgress: 45,
        description: 'Wait for the Fish to be placed into the truck.'
    });
    objectives.push(getFood);

    positions.forEach(pos => {
        const newPoint = new Objectives.Point(pos, 3);
        newPoint.setModifierFlags(ObjectiveFlags.IS_IN_JOB_VEHICLE);
        newPoint.setOptions({ description: 'Drive to the designated point.' });
        objectives.push(newPoint);
    });

    const deliveryPoint = new Objectives.Point(
        {
            x: -1791.6790771484375,
            y: -1198.04833984375,
            z: 13.0029296875
        },
        3,
        'dropoff:fish'
    );
    deliveryPoint.setModifierFlags(
        ObjectiveFlags.IS_CAPTURE | ObjectiveFlags.IS_IN_JOB_VEHICLE
    );
    deliveryPoint.setOptions({
        maxProgress: 45,
        description: 'Wait for the fish to be unloaded.'
    });
    objectives.push(deliveryPoint);

    const endPoint = new Objectives.Point(
        {
            x: 1171.4505615234375,
            y: -3199.6220703125,
            z: 5.791259765625
        },
        3
    );
    endPoint.setModifierFlags(
        ObjectiveFlags.IS_CAPTURE | ObjectiveFlags.IS_IN_JOB_VEHICLE
    );
    endPoint.setOptions({ description: 'Drive your vehicle back to the dock.' });
    objectives.push(endPoint);

    new Job(player, jobIdentifier, [...objectives]);
    player.job.start();
}

function completedJob(identifier, player) {
    if (jobIdentifier !== identifier) {
        return;
    }
}

function completedObjective(identifier, objective, player) {
    if (jobIdentifier !== identifier) {
        return;
    }

    if (!objective.identifier) {
        return;
    }
}
