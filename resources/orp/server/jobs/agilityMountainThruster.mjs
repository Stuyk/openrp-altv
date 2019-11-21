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
const trackStart = { x: -2301.309814453125, y: 2558.16259765625, z: 2.134765625 };
const trackPoints = [];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:MountainThruster',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(480, 4, jobName, 'agility');

alt.on('job:MountainThruster', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your waterscooter.');
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
    obj.setVehicle('thruster', trackStart);
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

    let pos = { x: -1186.2593994140625, y: 3856.404296875, z: 489.987548828125 };
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
