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

const jobName = 'Taxi Depot';
const trackStart = {
    x: 895.7274780273438,
    y: -179.56483459472656,
    z: 74.6900634765625
};
const interactionPoint = { ...trackStart };
interactionPoint.z -= 5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:TaxiJob',
    2,
    20,
    'to work as a taxi driver.'
);
interaction.addBlip(56, 5, jobName);

alt.on('job:TaxiJob', player => {
    let pos;
    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: true }]);
    //job.setUniform('TrackSuit');

    // Starting Point
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    pos = {
        x: 909.7714233398438,
        y: -170.03076171875,
        z: 73.15087890625
    };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Pick up your vehicle.');
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
    obj.setVehicle('taxi', pos);
    job.add(copyObjective(obj));

    // Starting Point
    obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
    pos = {
        x: 918.5274658203125,
        y: -182.967041015625,
        z: 72.999267578125
    };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Exit the taxi station.');
    obj.setBlip(1, 1, pos);
    obj.setMarker(
        0,
        pos,
        emptyVector,
        emptyVector,
        new alt.Vector3(5, 5, 1),
        0,
        255,
        0,
        100
    );
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    // Begin Searching for Player
    obj = new Objective(objectives.PLAYER, modifiers.PICKUP_PLAYER);
    obj.setRange(3);
    obj.setPosition(emptyVector);
    obj.setBlip(1, 1, new alt.Vector3(0, 0, 0));
    obj.setHelpText('Wait for a customer...');
    job.add(copyObjective(obj));

    obj = new Objective(objectives.PLAYER, modifiers.DROPOFF_PLAYER);
    obj.setRange(3);
    obj.setPosition(emptyVector);
    obj.setBlip(1, 1, new alt.Vector3(0, 0, 0));
    obj.setHelpText('Drop off your user.');
    job.add(copyObjective(obj));

    job.start(player);
});
