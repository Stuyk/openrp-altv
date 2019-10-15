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

const jobName = 'Mechanic Shop';
const trackStart = {
    x: 537.7582397460938,
    y: -182.4659423828125,
    z: 53.4366455078125
};
const interactionPoint = { ...trackStart };
interactionPoint.z -= 5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:MechanicJob',
    2,
    20,
    'to work as a mechanic.'
);
interaction.addBlip(566, 26, jobName);

alt.on('job:MechanicJob', player => {
    let pos;
    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: true }]);
    //job.setUniform('TrackSuit');

    // Starting Point
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    pos = {
        x: 530.4395751953125,
        y: -189.11209106445312,
        z: 52.5941162109375
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
    obj.setVehicle('burrito3', pos);
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    // Begin Searching for Player
    obj = new Objective(objectives.PLAYER, modifiers.GOTO_PLAYER);
    obj.setRange(5);
    obj.setPosition(emptyVector);
    obj.setBlip(1, 1, new alt.Vector3(0, 0, 0));
    obj.setHelpText('Wait for a customer...');
    obj.setAnimationScenario('world_human_vehicle_mechanic');
    job.add(copyObjective(obj));

    // Begin Searching for Player
    obj = new Objective(objectives.PLAYER, modifiers.REPAIR_PLAYER);
    obj.setRange(5);
    obj.setPosition(emptyVector);
    obj.setBlip(1, 1, new alt.Vector3(0, 0, 0));
    obj.setHelpText('Go to your customer...');
    obj.setAnimationScenario('world_human_vehicle_mechanic');
    obj.setRewards([{ type: 'xp', prop: 'mechanic', quantity: 500 }]);
    job.add(copyObjective(obj));

    job.start(player);
});
