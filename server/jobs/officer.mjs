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

const jobName = 'Officer';
const trackStart = { x: 458.305419921875, y: -990.7243041992188, z: 30.68960189819336 };
const interactionPoint = { ...trackStart };
const vehicles = ['police', 'police2', 'police3', 'policet'];
interactionPoint.z -= 5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:Officer',
    2,
    20,
    'to work as a police officer.'
);
interaction.addBlip(60, 38, jobName);

alt.on('job:Officer', player => {
    let pos;
    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING, '{0099ff}');
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: true }]);
    job.setLevelRestrictions([{ skill: 'nobility', xp: '13363' }]);
    job.setUniform('policeuniform');

    // Starting Point
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    pos = { x: 435.2911071777344, y: -981.773681640625, z: 30.690650939941406 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Exit the station.');
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

    pos = { x: 407.7098083496094, y: -997.7537231445312, z: 29.266338348388672 };
    obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Retreive your patrol car.');
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
    let index = Math.floor(Math.random() * vehicles.length);
    player.send(`Your Cruiser Model: ${vehicles[index]}`);
    obj.setVehicle(vehicles[index], pos, 180);
    job.add(copyObjective(obj));

    // Infinite Loop
    obj = new Objective(objectives.INFINITE, modifiers.MIN);
    job.add(copyObjective(obj));

    // Begin Searching for Player
    obj = new Objective(objectives.PLAYER, modifiers.NULL_PLAYER);
    obj.setRange(3);
    obj.setPosition(emptyVector);
    obj.setHelpText(
        'Use `/mdc` to access your terminal. Patrol for any logged criminals.'
    );
    job.add(copyObjective(obj));

    job.start(player);
});
