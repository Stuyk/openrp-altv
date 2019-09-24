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
const trackStart = {
    x: -1621.039306640625,
    y: -1169.6671142578125,
    z: 2.3566112518310547
};
const trackPoints = [
    { x: -1641.05078125, y: -1187.6304931640625, z: 1.003975749015808 },
    { x: -1674.8817138671875, y: -1219.8265380859375, z: 0.38826215267181396 },
    { x: -1689, y: -1244.322998046875, z: -0.3423924148082733 },
    { x: -1665.0172119140625, y: -1254.8548583984375, z: 0.0902937576174736 },
    { x: -1640.7608642578125, y: -1254.4713134765625, z: 0.2765565812587738 },
    { x: -1612.96484375, y: -1223.9820556640625, z: 0.24614903330802917 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:AgilityWorkout',
    2,
    20,
    'to begin training agility.'
);
interaction.addBlip(126, 6, jobName);

alt.on('job:AgilityWorkout', player => {
    let pos;
    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    //job.setUniform('TrackSuit');

    // Starting Point
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Go to the starting point.');
    obj.setBlip(1, 2, trackStart);
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
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
        obj.setHelpText('Swim to your destination.');
        obj.setRange(3);
        obj.setPosition(pos);
        obj.setBlip(1, 2, pos);
        obj.setMarker(
            0,
            pos,
            emptyVector,
            emptyVector,
            new alt.Vector3(0.5, 0.5, 5),
            0,
            255,
            0,
            100
        );
        obj.setFinishedSound('complete');
        obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 25 }]);
        job.add(copyObjective(obj));
    });

    // Workout Objectives
    pos = { x: -1586.99072265625, y: -1187.1585693359375, z: 1.9964627027511597 };
    obj = new Objective(objectives.HOLD, modifiers.ON_FOOT);
    obj.setHelpText('Do some sit ups by holding ~INPUT_CONTEXT~');
    obj.setRange(3);
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
    obj.setAnimationScenario('world_human_sit_ups');
    obj.setMaxProgress(2);
    obj.setFinishedSound('complete');
    obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 35 }]);
    job.add(copyObjective(obj));

    pos = { x: -1594.2423095703125, y: -1173.86279296875, z: 1.9826781749725342 };
    obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
    obj.setHelpText('Do some push ups by mashing ~INPUT_CONTEXT~');
    obj.setRange(3);
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
    obj.setAnimationScenario('world_human_push_ups');
    obj.setMaxProgress(8);
    obj.setFinishedSound('complete');
    obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 35 }]);
    job.add(copyObjective(obj));

    job.start(player);
});
