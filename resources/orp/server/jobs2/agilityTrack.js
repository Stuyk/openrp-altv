import * as alt from 'alt';
import { Interaction } from '../systems/interaction.js';
import { Job, Objectives, ObjectiveFlags } from '../systems/job2.js';
import { PedStream } from '../systems/pedstream.js';
import { addXP } from '../systems/skills.js';
import { distance } from '../utility/vector.js';

const jobIdentifier = 'job:AgilityTrack1';
alt.onClient(jobIdentifier, startJob);
alt.on('job:Complete', completedJob);
alt.on('job:ObjectiveComplete', completedObjective);

const positions = [
    {
        x: -1716.870361328125,
        y: 171.77142333984375,
        z: 64.3612060546875
    },
    {
        x: -1741.3582763671875,
        y: 195.23077392578125,
        z: 64.3612060546875
    },
    {
        x: -1769.4329833984375,
        y: 178.60220336914062,
        z: 64.3612060546875
    },
    {
        x: -1758.4483642578125,
        y: 145.95164489746094,
        z: 64.3612060546875
    },
    {
        x: -1727.6043701171875,
        y: 121.68791198730469,
        z: 64.3612060546875
    },
    {
        x: -1698.5538330078125,
        y: 143.09011840820312,
        z: 64.3612060546875
    }
];

const startPoint = {
    x: -1692.0887451171875,
    y: 146.54879760742188,
    z: 64.37202453613281
};

const pedStream = new PedStream('a_f_y_runner_01', startPoint, 160, 'Agility Training');
pedStream.addInteraction({
    name: 'Run a Lap',
    isServer: true,
    eventName: jobIdentifier,
    data: {}
});

function startJob(player) {
    console.log('fired');

    if (distance(player.pos, startPoint) > 5) {
        return;
    }

    console.log('starting?');

    const objectives = [];
    positions.forEach(pos => {
        const objective = new Objectives.Point(pos, 3);
        objective.setOptions({
            blip: { sprite: 1, color: 1 },
            description: 'Run to the point.',
            scale: { x: 2, y: 2, z: 0.5 }
        });
        objective.setModifierFlags(ObjectiveFlags.ON_FOOT);
        objectives.push(objective);
    });

    new Job(player, jobIdentifier, [...objectives]);
    player.job.start();
}

function completedJob(identifier, player) {
    if (jobIdentifier !== identifier) {
        return;
    }

    player.notify('Lap Complete');
}

function completedObjective(identifier, objective, player) {
    if (jobIdentifier !== identifier) {
        return;
    }

    if (!objective.identifier) {
        addXP(player, 'agility', 20);
        return;
    }
}
