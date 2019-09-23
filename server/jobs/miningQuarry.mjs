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

const jobName = 'Mining';
const trackStart = {
    x: 2945.88427734375,
    y: 2746.795654296875,
    z: 42.401432037353516
};
const trackPoints = [
    { x: 2980.4287109375, y: 2750.4375, z: 42.94373321533203 },
    { x: 2997.025634765625, y: 2751.058349609375, z: 44.1826057434082 },
    { x: 3004.7255859375, y: 2783.447021484375, z: 44.64783477783203 },
    { x: 2985.524169921875, y: 2817.20458984375, z: 45.981040954589844 },
    { x: 2975.896240234375, y: 2793.125244140625, z: 40.72920608520508 },
    { x: 2969.200927734375, y: 2776.583251953125, z: 38.388397216796875 }
];

const interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:MiningQuarry',
    3,
    3,
    'to begin mining for ore.'
);
interaction.addBlip(78, 6, jobName);

alt.on('job:MiningQuarry', player => {
    let job = new Job(
        player,
        jobName,
        restrictions.NO_VEHICLES | restrictions.NO_DIEING | restrictions.NO_WEAPONS
    );
    job.setItemRestrictions([{ label: 'Pickaxe', hasItem: true }]);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(5);
    obj.setHelpText('');
    obj.setBlip(367, 2, trackStart);
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
        obj = new Objective(objectives.MASH, modifiers.ON_FOOT);
        obj.setHelpText('Mine ore by mashing ~INPUT_CONTEXT~');
        obj.setPosition(pos);
        obj.setBlip(367, 2, pos);
        obj.setRange(3);
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
        obj.setRewards([
            { type: 'xp', prop: 'mining', quantity: 20 },
            { type: 'item', prop: 'UnrefinedRock', quantity: 1 }
        ]);
        obj.setMaxProgress(10);
        obj.setAnimationAndSound(
            'melee@large_wpn@streamed_core',
            'ground_attack_on_spot',
            1,
            -1,
            [{ name: 'dirt', time: 0.35 }]
        );
        // core ent_dst_rocks 20 1 0 0.8 -1
        obj.setParticleEffect([
            {
                dict: 'core',
                name: 'ent_dst_rocks',
                duration: 200,
                scale: 1,
                offset: { x: 0, y: 0.8, z: -1 },
                time: 0.35 // Animation times to play at.
            },
            {
                dict: 'core',
                name: 'ent_anim_dusty_hands',
                duration: 200,
                scale: 2.5,
                offset: { x: 0, y: -0.2, z: 1 },
                time: 0.65
            }
        ]);
        job.add(copyObjective(obj));
    });

    job.start(player);
});
