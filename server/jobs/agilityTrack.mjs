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
const trackStart = { x: -1697.0869140625, y: 142.81460571289062, z: 64.37159729003906 };
const trackPoints = [
    { x: -1717.818359375, y: 173.0086669921875, z: 64.37152862548828 },
    { x: -1733.586181640625, y: 191.8198699951172, z: 64.37095642089844 },
    { x: -1764.5313720703125, y: 187.3607177734375, z: 64.37181091308594 },
    { x: -1765.78955078125, y: 156.7715301513672, z: 64.37181091308594 },
    { x: -1748.8880615234375, y: 132.46299743652344, z: 64.37181091308594 },
    { x: -1714.2867431640625, y: 126.52886962890625, z: 64.37163543701172 },
    { x: -1707.92431640625, y: 158.70193481445312, z: 64.37149047851562 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:AgilityTrack',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(126, 2, jobName);

alt.on('job:AgilityTrack', player => {
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    job.setUniform('TrackSuit');

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(2);
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
        obj.setHelpText('Sprint!');
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
        obj.setFinishedObjectiveSound('complete');
        obj.setRewards([{ type: 'xp', prop: 'agility', quantity: 20 }]);
        job.add(copyObjective(obj));
    });

    job.start(player);
});
