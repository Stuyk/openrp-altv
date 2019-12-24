import * as alt from 'alt';

import { Interaction } from '../systems/interaction.js';
import { Job, Objectives, ObjectiveFlags } from '../systems/job2.js';

const jobIdentifier = 'job:ExampleJob';
alt.on(jobIdentifier, startJob);
alt.on('job:Complete', completedJob);
alt.on('job:ObjectiveComplete', completedObjective);

const startPoint = { x: 146.79, y: 6630.34, z: 31.67 };
const interaction = new Interaction(
    startPoint,
    'job',
    jobIdentifier,
    3,
    3,
    'to try out the shooting range.'
);
interaction.addBlip(313, 4, jobIdentifier, 'Demo');

function startJob(player) {
    const objectives = [];
    const point1 = { x: 150.46493530273438, y: 6637.37451171875, z: 31.613073348999023 };
    const point1Obj = new Objectives.Point(point1, 3);
    point1Obj.setModifierFlags(ObjectiveFlags.ON_FOOT);
    objectives.push(point1Obj);

    const point2 = { x: 155.80323791503906, y: 6642.73046875, z: 31.60428237915039 };
    const point2Obj = new Objectives.Point(point2, 3);
    point2Obj.identifier = 'explode';
    point2Obj.setModifierFlags(ObjectiveFlags.ON_FOOT | ObjectiveFlags.IS_CAPTURE);
    objectives.push(point2Obj);

    const point3 = { x: 141.7765350341797, y: 6636.1162109375, z: 31.617679595947266 };
    const point3Obj = new Objectives.Point(point3, 3, 'explode');
    point3Obj.setModifierFlags(ObjectiveFlags.ON_FOOT);
    objectives.push(point3Obj);

    new Job(player, jobIdentifier, [...objectives]);
    player.job.start();
}

function completedJob(identifier, player) {
    if (jobIdentifier !== identifier) {
        return;
    }

    player.send('{FFFF00} Job has been completed. Try another round.');
    player.addItem('unrefinedmetal', 1);
    player.notify('Added 1 Unrefined Metal');
}

function completedObjective(identifier, objective, player) {
    if (jobIdentifier !== identifier) {
        return;
    }

    if (!objective.identifier) {
        return;
    }

    alt.log(identifier);
    alt.log(objective);
    alt.log(player.data.name);

    if (objective.identifier === 'explode') {
        console.log('Exploding...');
        alt.emitClient(player, 'explosion:Play', objective.pos, 256);
        return;
    }
}

/*

[09:21:49] 
[09:21:57] {"x":141.7765350341797,"y":6636.1162109375,"z":31.617679595947266}
*/
