import * as alt from 'alt';
import { Interaction } from '../systems/interaction.js';
import { Job, Objectives, ObjectiveFlags } from '../systems/job2.js';

const jobIdentifier = 'job:ShootingRange1';
alt.on('job:ShootingRange1', startJob);
alt.on('job:Complete', completedJob);
alt.on('job:ObjectiveComplete', completedObjective);

const positions = [
    { x: 20.420696258544922, y: -1090.2625732421875, z: 29.7962646484375 },
    { x: 20.081329345703125, y: -1083.61962890625, z: 29.79705810546875 },
    { x: 16.442224502563477, y: -1077.5777587890625, z: 29.797040939331055 },
    { x: 20.236013412475586, y: -1074.916015625, z: 29.797040939331055 },
    { x: 13.37805461883545, y: -1084.8057861328125, z: 29.795671463012695 },
    { x: 15.975090980529785, y: -1091.344482421875, z: 29.797260284423828 }
];

const startPoint = { x: 12.9, y: -1099.2, z: 29.2 };
const interaction = new Interaction(
    startPoint,
    'job',
    jobIdentifier,
    3,
    3,
    'to try out the shooting range.'
);
interaction.addBlip(313, 4, jobIdentifier, 'Shooting Range');

function startJob(player) {
    if (!player.equipment[11] || player.equipment[11].base !== 'weapon') {
        player.send('You must have a weapon to use the shooting range.');
        return;
    }

    const objectives = [];
    positions.forEach(pos => {
        const shootObjective = new Objectives.DestroyObject(pos, 50, 1, {
            r: 255,
            g: 255,
            b: 255,
            a: 75
        });
        shootObjective.setOptions({
            description: 'Shoot the object',
            blip: { sprite: 1, color: 1 },
            maxProgress: 1,
            objectType: 'gr_prop_gr_target_02a',
            objectAlpha: 255
        });
        objectives.push(shootObjective);
    });

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

function completedObjective(identifier, player) {
    if (jobIdentifier !== identifier) {
        return;
    }

    player.send('{00FF00} Nice Shot!');
}
