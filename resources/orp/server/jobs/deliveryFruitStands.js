import * as alt from 'alt';
import {
    Job,
    Objective,
    copyObjective,
    objectives,
    modifiers,
    restrictions
} from '../systems/job.js';
import { Interaction } from '../systems/interaction.js';

const trackPoints = [
    { x: -1044.913818359375, y: 5329.1689453125, z: 44.439762115478516 },
    { x: -2505.95068359375, y: 3614.43017578125, z: 13.750921249389648 },
    { x: -3021.44287109375, y: 369.2389221191406, z: 14.54427433013916 },
    { x: -1381.2884521484375, y: 739.3947143554688, z: 183.18040466308594 },
    { x: 1041.984375, y: 698.6554565429688, z: 158.71331787109375 },
    { x: 1088.787353515625, y: 6506.16650390625, z: 20.927417755126953 }
];

const jobName = 'Delivery Truck Driver';
const trackStart = { x: 184.4820556640625, y: 6396.87353515625, z: 31.874797821044922 };
let interactionPoint = { ...trackStart };
interactionPoint.z -= 1.0;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:DeliveryFruitStand',
    3,
    3,
    `to work as a delivery driver.`
);
interaction.addBlip(642, 5, jobName, 'delivery');

alt.on('job:DeliveryFruitStand', player => {
    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: true }]);
    let pos;
    let obj;

    obj = new Objective(objectives.POINT);
    pos = { x: 191.58453369140625, y: 6399.60888671875, z: 31.3845272064209 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Head over to the point to grab your vehicle.');
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
        'benson',
        { x: 200.13836669921875, y: 6404.39794921875, z: 31.381919860839844 },
        54,
        true
    );
    job.add(copyObjective(obj));

    obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
    pos = { x: 99.33358001708984, y: 6411.630859375, z: 31.336259841918945 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Exit the area.');
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
        obj = new Objective(objectives.CAPTURE, modifiers.IN_VEHICLE);
        pos = point;
        obj.setPosition(pos);
        obj.setRange(10);
        obj.setHelpText('Drive to the fruit stand.');
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

    obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
    pos = { x: 200.53575134277344, y: 6387.83251953125, z: 31.383840560913086 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Park your vehicle.');
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
        { type: 'xp', prop: 'nobility', quantity: 125 },
        { type: 'xp', prop: 'notoriety', quantity: -500 },
        {
            type: 'table',
            prop: 'rawfish',
            skill: 'fishing',
            quantity: 5,
            givexp: false
        }
    ]);
    job.add(copyObjective(obj));

    job.start(player);
});
