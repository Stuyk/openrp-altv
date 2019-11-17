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
const trackStart = { x: 498.88104248046875, y: 5551.96484375, z: 782.4734497070312 };
const trackPoints = [
    { x: 489.6177978515625, y: 5525.9453125, z: 777.9534301757812 },
    { x: 426.42230224609375, y: 5504.8330078125, z: 742.3065795898438 },
    { x: 374.739501953125, y: 5492.58984375, z: 711.0394287109375 },
    { x: 360.5569152832031, y: 5461.67529296875, z: 689.4784545898438 },
    { x: 326.1129150390625, y: 5418.32861328125, z: 658.569580078125 },
    { x: 302.73553466796875, y: 5374.6337890625, z: 639.2135620117188 },
    { x: 248.06004333496094, y: 5319.6337890625, z: 624.5822143554688 },
    { x: 226.798583984375, y: 5248.880859375, z: 601.3161010742188 },
    { x: 182.6714324951172, y: 5218.77783203125, z: 578.471923828125 },
    { x: 136.52304077148438, y: 5188.1513671875, z: 550.253662109375 },
    { x: 129.92831420898438, y: 5223.21435546875, z: 543.8598022460938 },
    { x: 114.48892211914062, y: 5186.20361328125, z: 531.8773193359375 },
    { x: 98.99732208251953, y: 5079.841796875, z: 500.2679443359375 },
    { x: 94.9437484741211, y: 5030.77294921875, z: 468.10418701171875 },
    { x: 52.71207046508789, y: 5038.85693359375, z: 460.6723327636719 },
    { x: 12.868022918701172, y: 5016.41064453125, z: 449.9488220214844 },
    { x: -11.633190155029297, y: 5007.81005859375, z: 435.6792907714844 },
    { x: -59.17723083496094, y: 4976.412109375, z: 398.2386779785156 },
    { x: -135.52049255371094, y: 4916.20849609375, z: 353.6183776855469 },
    { x: -238.2459716796875, y: 4914.65380859375, z: 302.39373779296875 },
    { x: -296.0702209472656, y: 4967.36474609375, z: 248.01011657714844 },
    { x: -336.6624450683594, y: 4996.978515625, z: 222.8302459716797 },
    { x: -372.93798828125, y: 4956.640625, z: 199.49073791503906 },
    { x: -406.91400146484375, y: 4925.9541015625, z: 182.44699096679688 },
    { x: -461.7706298828125, y: 4955.27734375, z: 155.90748596191406 },
    { x: -548.0357666015625, y: 5041.38134765625, z: 128.4569549560547 },
    { x: -597.4150390625, y: 5088.638671875, z: 129.8170928955078 },
    { x: -592.1260375976562, y: 5155.52587890625, z: 108.58475494384766 },
    { x: -545.5164794921875, y: 5176.15478515625, z: 94.09138488769531 },
    { x: -574.2772216796875, y: 5211.37060546875, z: 83.4716796875 },
    { x: -596.757568359375, y: 5211.4267578125, z: 79.66156768798828 },
    { x: -596.77490234375, y: 5239.517578125, z: 71.13289642333984 },
    { x: -615.7044677734375, y: 5287.32470703125, z: 61.31085205078125 },
    { x: -639.9322509765625, y: 5348.9072265625, z: 51.715335845947266 },
    { x: -653.4678344726562, y: 5396.8359375, z: 48.119239807128906 },
    { x: -679.1151123046875, y: 5433.18505859375, z: 42.539764404296875 },
    { x: -714.2765502929688, y: 5455.4013671875, z: 39.17495346069336 },
    { x: -748.6152954101562, y: 5465.54345703125, z: 36.66675567626953 },
    { x: -729.7044067382812, y: 5577.5419921875, z: 36.07952117919922 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:MtnBike1',
    3,
    3,
    'to begin training agility.'
);
interaction.addBlip(126, 6, jobName, 'agility');

let gondolaBottom = { x: -738.5142211914062, y: 5595.1279296875, z: 40.65458297729492 };
let gondolaTop = { x: 444.1629333496094, y: 5571.96533203125, z: 780.1889038085938 };

interaction = new Interaction(
    gondolaBottom,
    'teleport',
    'teleport:GondolaTop',
    3,
    3,
    'To take the gondola to the top.'
);
interaction.addBlip(36, 60, 'Gondola');

alt.on('teleport:GondolaTop', player => {
    player.pos = gondolaTop;
});

interaction = new Interaction(
    gondolaTop,
    'teleport',
    'teleport:GondolaBottom',
    3,
    3,
    'To take the gondola to the bottom.'
);
interaction.addBlip(36, 60, 'Gondola');

alt.on('teleport:GondolaBottom', player => {
    player.pos = gondolaBottom;
});

alt.on('job:MtnBike1', player => {
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);

    // Set First Objective
    const emptyVector = { x: 0, y: 0, z: 0 };
    let obj = new Objective(objectives.POINT, modifiers.ON_FOOT);
    obj.setPosition(trackStart);
    obj.setRange(3);
    obj.setHelpText('Pick up your bike.');
    obj.setBlip(1, 1, trackStart);
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
    obj.setVehicle('scorcher', trackStart);
    job.add(copyObjective(obj));

    // Setup the rest of the points.
    trackPoints.forEach(pos => {
        obj = new Objective(objectives.POINT, modifiers.IN_VEHICLE);
        obj.setHelpText('Follow the course down.');
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
    });

    let pos = { x: -729.7044067382812, y: 5577.5419921875, z: 36.07952117919922 };
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
