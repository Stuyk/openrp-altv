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

const approvedVehicles = ['hauler', 'phantom', 'packer', 'phantom3'];
const jobName = 'Trucking - Unrefined Vigorium';
const trackStart = { x: 405.40106201171875, y: 6526.296875, z: 27.68805503845215 };
let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:TruckingUnrefinedVigorium',
    3,
    3,
    `to work as a trucker.`
);
interaction.addBlip(85, 6, jobName);

const track1 = [
    {
        x: 436.77362060546875,
        y: 6561.666015625,
        z: 27.999267578125
    },
    {
        x: 2577.5869140625,
        y: 5216.703125,
        z: 45.6072998046875
    },
    {
        x: 3180.936279296875,
        y: 3510.09228515625,
        z: 71.859375
    },
    {
        x: 3513.217529296875,
        y: 3664.905517578125,
        z: 34.789794921875
    },
    {
        x: 3562.826416015625,
        y: 3674.08349609375,
        z: 34.806640625
    },
    {
        x: 3523.358154296875,
        y: 3673.8330078125,
        z: 34.789794921875
    }
];

const track2 = [
    {
        x: 440.03076171875,
        y: 6560.68994140625,
        z: 26.4322509765625
    },
    {
        x: 2268.936279296875,
        y: 5894.38671875,
        z: 48.16845703125
    },
    {
        x: 2669.010986328125,
        y: 4861.05517578125,
        z: 43.972900390625
    },
    {
        x: 2751.388916015625,
        y: 4462.70751953125,
        z: 47.056396484375
    },
    {
        x: 2746.536376953125,
        y: 4396.78662109375,
        z: 48.23583984375
    },
    {
        x: 2157.151611328125,
        y: 3777.217529296875,
        z: 32.6497802734375
    },
    {
        x: 1864.24609375,
        y: 3701.74951171875,
        z: 32.85205078125
    }
];

const track3 = [
    {
        x: 458.18902587890625,
        y: 6557.32763671875,
        z: 26.3480224609375
    },
    {
        x: 2200.23291015625,
        y: 5958.19775390625,
        z: 50.2579345703125
    },
    {
        x: 2592.606689453125,
        y: 5136.69873046875,
        z: 44.0908203125
    },
    {
        x: 1668,
        y: 4837.42431640625,
        z: 41.3612060546875
    },
    {
        x: 1679.5384521484375,
        y: 4813.05517578125,
        z: 41.3106689453125
    },
    {
        x: 1658.914306640625,
        y: 4827.138671875,
        z: 41.3443603515625
    },
    {
        x: 1641.7978515625,
        y: 4831.7275390625,
        z: 41.3612060546875
    },
    {
        x: 1638.19775390625,
        y: 4845.12548828125,
        z: 41.3612060546875
    }
];

const trackPoints = [track1, track2, track3];

alt.on('job:TruckingUnrefinedVigorium', player => {
    if (!player.vehicles) return;
    if (player.vehicles.length <= 0) return;

    const truck = player.vehicles.find(veh => {
        if (approvedVehicles.includes(veh.data.model)) return veh;
    });

    if (!truck) {
        player.send('Must have a hauler, packer, phantom, or phantom3 for this job.');
        return;
    }

    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: false }]);
    let pos;
    let obj;

    obj = new Objective(objectives.POINT);
    pos = { x: 404.5831604003906, y: 6493.13623046875, z: 28.085969924926758 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Hop in your vehicle; and head over to the pickup point.');
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
    obj.setVehicle(
        'trailers',
        { x: 428.0458984375, y: 6470.720703125, z: 28.787019729614258 },
        52,
        false
    );
    obj.setFinishedSound('complete');
    job.add(copyObjective(obj));

    // Exit Point
    obj = new Objective(objectives.POINT, modifiers.IS_TRAILER);
    pos = { x: 427.23455810546875, y: 6547.58056640625, z: 27.607145309448242 };
    obj.setPosition(pos);
    obj.setRange(5);
    obj.setHelpText('Drive the trailer to the point.');
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
    obj.setFinishedSound('complete');
    job.add(copyObjective(obj));

    // Routing Code
    const course = Math.floor(Math.random() * trackPoints.length);
    trackPoints[course].forEach((point, index) => {
        obj = new Objective(objectives.POINT, modifiers.IS_TRAILER);
        pos = point;
        obj.setPosition(pos);
        obj.setRange(5);
        obj.setHelpText('Drive the trailer to the point.');
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
        if (index === trackPoints[course].length - 1) {
            obj.setRewards([
                { type: 'xp', prop: 'gathering', quantity: 160 },
                { type: 'item', prop: 'unrefinedvigorium', quantity: 14 }
            ]);
        }
        obj.setFinishedSound('complete');
        job.add(copyObjective(obj));
    });

    job.start(player);
});
