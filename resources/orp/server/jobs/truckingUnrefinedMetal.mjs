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

const approvedVehicles = ['hauler', 'phantom', 'packer', 'phantom3'];
const jobName = 'Trucking - Unrefined Metal';
const trackStart = { x: 2745.89013671875, y: 2788.271728515625, z: 35.45252227783203 };
let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:TruckingUnrefinedMetal',
    3,
    3,
    `to work as a trucker.`
);
interaction.addBlip(85, 6, jobName, 'trucking');

const trackPoints = [
    {
        x: 2562.843994140625,
        y: 2653.358154296875,
        z: 39.8447265625
    },
    {
        x: 2559.349365234375,
        y: 2219.7890625,
        z: 20.0966796875
    },
    {
        x: 2539.701171875,
        y: 1685.4197998046875,
        z: 28.6900634765625
    },
    {
        x: 2354.597900390625,
        y: 1177.6351318359375,
        z: 60.940673828125
    },
    {
        x: 2488.681396484375,
        y: 800.2417602539062,
        z: 96.3927001953125
    },
    {
        x: 2483.010986328125,
        y: -16.24615478515625,
        z: 94.775146484375
    },
    {
        x: 1606.6417236328125,
        y: -952.7604370117188,
        z: 62.94580078125
    },
    {
        x: 1333.89892578125,
        y: -1092.830810546875,
        z: 52.7347412109375
    },
    {
        x: 1093.5032958984375,
        y: -1181.85498046875,
        z: 47.10693359375
    },
    {
        x: 1048.4176025390625,
        y: -1651.6219482421875,
        z: 31.049072265625
    },
    {
        x: 1094.795654296875,
        y: -1824.3824462890625,
        z: 37.873291015625
    },
    {
        x: 1096.23291015625,
        y: -1858.826416015625,
        z: 38.05859375
    },
    {
        x: 1061.3143310546875,
        y: -1898.4263916015625,
        z: 31.942138671875
    },
    {
        x: 1057.7142333984375,
        y: -1978.5362548828125,
        z: 31.92529296875
    }
];

alt.on('job:TruckingUnrefinedMetal', player => {
    if (!player.vehicles) return;
    if (player.vehicles.length <= 0) return;

    const truck = player.vehicles.find(veh => {
        if (approvedVehicles.includes(veh.data.model)) return veh;
    });

    if (!truck) {
        player.send('Must have a hauler, packer, phantom, or phantom3 for this job.');
        return;
    }

    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: true }]);
    let pos;
    let obj;

    obj = new Objective(objectives.POINT);
    pos = { x: 2692.734619140625, y: 2760.795166015625, z: 37.838600158691406 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Hop in your vehicle; and head over to the pickup point.');
    obj.setBlip(1, 1, pos);
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
    obj.setVehicle(
        'trailers',
        { x: 2699.307861328125, y: 2776.710693359375, z: 39.877986907958984 },
        128,
        false
    );
    job.add(copyObjective(obj));

    obj = new Objective(objectives.POINT, modifiers.IS_TRAILER);
    pos = { x: 2676.414794921875, y: 2743.995849609375, z: 38.11985778808594 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Drive the trailer to the point.');
    obj.setBlip(1, 1, pos);
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

    obj = new Objective(objectives.POINT, modifiers.IS_TRAILER);
    pos = { x: 2619.3095703125, y: 2731.669921875, z: 40.73603057861328 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Drive the trailer to the point.');
    obj.setBlip(1, 1, pos);
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

    trackPoints.forEach(point => {
        obj = new Objective(objectives.POINT, modifiers.IS_TRAILER);
        pos = point;
        obj.setPosition(pos);
        obj.setRange(5);
        obj.setHelpText('Drive the trailer to the point.');
        obj.setBlip(1, 1, pos);
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
    });

    obj = new Objective(objectives.POINT, modifiers.IS_TRAILER);
    pos = { x: 1068.3582763671875, y: -1962.1356201171875, z: 31.93212890625 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Park the Trailer.');
    obj.setBlip(1, 1, pos);
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
    obj.setRewards([
        { type: 'xp', prop: 'mining', quantity: 160 },
        { type: 'item', prop: 'refinedmetal', quantity: 21 }
    ]);
    job.add(copyObjective(obj));

    job.start(player);
});
