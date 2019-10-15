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

const jobName = 'Driving School';
const trackStart = { x: -914.881591796875, y: -2038.506591796875, z: 9.40499496459961 };
const vehiclePool = [
    'tailgater',
    'surge',
    'stratum',
    'primo',
    'emperor',
    'asterope',
    'asea',
    'premier',
    'ingot',
    'glendale'
];

const endPoints = [
    { x: -897.640869140625, y: -2035.5670166015625, z: 9.299139976501465 },
    { x: -882.348388671875, y: -2049.380615234375, z: 9.29915714263916 },
    { x: -887.0839233398438, y: -2054.05419921875, z: 9.303821563720703 },
    { x: -892.1035766601562, y: -2058.80908203125, z: 9.299005508422852 },
    { x: -904.2120361328125, y: -2043.752197265625, z: 9.299004554748535 }
];

let interactionPoint = { ...trackStart };
interactionPoint.z -= 0.5;
let interaction = new Interaction(
    interactionPoint,
    'job',
    'job:DrivingSchool',
    3,
    3,
    `to begin earning your driver's license.`
);
interaction.addBlip(380, 6, jobName);

alt.on('job:DrivingSchool', player => {
    const emptyVector = { x: 0, y: 0, z: 0 };
    let job = new Job(player, jobName, restrictions.NO_DIEING | restrictions.NO_WEAPONS);
    job.setItemRestrictions([{ key: 'driverslicense', hasItem: false }]);
    let pos;
    let obj;

    obj = new Objective(
        objectives.POINT,
        modifiers.ON_FOOT | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -891.093994140625, y: -2043.416015625, z: 9.299142837524414 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Pick up your vehicle.');
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
    let randomVehicle = vehiclePool[Math.floor(Math.random() * vehiclePool.length)];
    obj.setVehicle(randomVehicle, pos);
    job.add(copyObjective(obj));

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -939.4230346679688, y: -2090.9091796875, z: 9.29926586151123 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive to the point.');
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

    obj = new Objective(
        objectives.CAPTURE,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -944.835205078125, y: -2124.258544921875, z: 9.304536819458008 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive and stop on the point.');
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
    obj.setMaxProgress(2);
    job.add(copyObjective(obj));

    obj = new Objective(
        objectives.CAPTURE,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -953.8446044921875, y: -2142.3818359375, z: 8.92033576965332 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive to the stop sign and wait before turning left.');
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
    obj.setMaxProgress(2);
    job.add(copyObjective(obj));

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -954.7821044921875, y: -2162.31787109375, z: 8.924131393432617 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Make the left hand turn.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -915.8634033203125, y: -2201.638916015625, z: 6.808885097503662 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive down the road.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -881.77880859375, y: -2236.140869140625, z: 5.807629108428955 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Slow down at the upcoming point; and make a right turn.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -880.6373291015625, y: -2250.850830078125, z: 6.355055809020996 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Pull into the driveway.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -910.375, y: -2268.717041015625, z: 6.7090301513671875 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive towards the back of the lot.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -935.9255981445312, y: -2313.71044921875, z: 6.709086894989014 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Slow down as you reach the end of the lot.');
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

    obj = new Objective(
        objectives.CAPTURE,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -932.1824951171875, y: -2322.33349609375, z: 6.709086894989014 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Pull into the designated space and wait.');
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
    obj.setMaxProgress(5);
    job.add(copyObjective(obj));

    obj = new Objective(
        objectives.CAPTURE,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -942.2203979492188, y: -2316.532958984375, z: 6.709092140197754 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Back up in the space behind you and wait.');
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
    obj.setMaxProgress(5);
    job.add(copyObjective(obj));

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -932.0474853515625, y: -2313.541259765625, z: 6.7090864181518555 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Pull out; and make a left hand turn.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -910.7393798828125, y: -2276.8076171875, z: 6.7090606689453125 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Make your way out of the lot.');
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

    obj = new Objective(
        objectives.CAPTURE,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -876.4159545898438, y: -2254.62451171875, z: 6.487254619598389 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Stop and yield; before driving out.');
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
    obj.setMaxProgress(1);
    job.add(copyObjective(obj));

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -880.4154052734375, y: -2228.4619140625, z: 5.839249610900879 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive down the road.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -925.2260131835938, y: -2183.1005859375, z: 8.850299835205078 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Drive down the road; make a right-hand turn next.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -949.4387817382812, y: -2147.18603515625, z: 8.850981712341309 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Make the right-hand turn; then a left-hand turn.');
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

    obj = new Objective(
        objectives.POINT,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = { x: -942.1173706054688, y: -2119.384521484375, z: 9.29825210571289 };
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Make the right-hand turn; then a left-hand turn.');
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

    obj = new Objective(
        objectives.CAPTURE,
        modifiers.IN_VEHICLE | modifiers.NO_DAMAGE_VEHICLE
    );
    pos = endPoints[Math.floor(Math.random() * endPoints.length)];
    obj.setPosition(pos);
    obj.setRange(3);
    obj.setHelpText('Park your vehicle at the end of the lot; and wait.');
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
    obj.setMaxProgress(3);
    obj.setRewards([{ type: 'item', prop: 'driverslicense', quantity: 1 }]);
    job.add(copyObjective(obj));

    job.start(player);
});
