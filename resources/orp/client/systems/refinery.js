import * as alt from 'alt';
import * as native from 'natives';
import { distance, lerpObject } from '/client/utility/vector.js';
import { createBlip } from '/client/blips/bliphelper.js';
import { PedStream } from '/client/systems/pedstream.js';

const metalHash = native.getHashKey('prop_rub_scrap_02');
const pressHash = native.getHashKey('prop_jyard_block_01a');
const conveyorHash = native.getHashKey('p_beefsplitter_s');
const pedHash = native.getHashKey('s_m_y_construct_01');
const pedLoc = { x: 1106.4517822265625, y: -2010.4033203125, z: 30.875410079956055 };
const pedHeading = 77.5;
const conveyor = {
    pos: {
        x: 1110.224,
        y: -2008.369,
        z: 29.9
    },
    rot: {
        x: 0,
        y: 0,
        z: -126
    }
};

const press = {
    pos: {
        x: 1109.8,
        y: -2007.369,
        z: 33
    },
    rot: {
        x: 270,
        y: 0,
        z: 145
    }
};

const points = [
    {
        pos: { x: 1110.463134765625, y: -2008.666748046875, z: 30.7 },
        rot: { x: 268, y: 0, z: 53 }
    },
    {
        pos: { x: 1109.5654296875, y: -2007.9676513671875, z: 30.7 },
        rot: { x: 268, y: 0, z: 53 }
    },
    {
        pos: { x: 1107.5421142578125, y: -2006.4971923828125, z: 30.7 },
        rot: { x: 268, y: 0, z: 53 }
    }
];

let isUp = true;
let conveyorID;
let pressID;
let metalInQueue = 0;
let processing = false;
let hasComeIntoView = false;
let metalCount = 0;
let metalSpawned = [];

function setup() {
    createBlip('metalworker', pedLoc, 657, 53, 'Refinery Worker');
    const hashes = [metalHash, pressHash, conveyorHash, pedHash];
    hashes.forEach(hash => {
        alt.loadModel(hash);
        native.requestModel(hash);
    });

    const pedStream = new PedStream(pedHash, pedLoc, pedHeading);
    pedStream.addInteraction(
        [
            {
                name: 'x1 - Use Unrefined Metal',
                isServer: true,
                eventName: 'refinery:UseUnrefinedMetal',
                data: { amount: 1 }
            }
        ],
        'Refinery Worker'
    );
    pedStream.addInteractAnimation('anim@mp_player_intselfiethumbs_up', 'idle_a', 2800);
}
setup();

async function spawnMetal() {
    if (metalInQueue <= 0 || processing || metalCount >= 3) {
        return;
    }

    processing = true;
    metalInQueue -= 1;

    const metalID = native.createObjectNoOffset(
        metalHash,
        points[0].pos.x,
        points[0].pos.y,
        points[0].pos.z,
        false,
        false,
        false
    );
    metalSpawned.push(metalID);
    native.freezeEntityPosition(metalID, true);
    native.setEntityCollision(metalID, false, false);

    for (let i = 0; i < points.length; i++) {
        native.setEntityRotation(
            metalID,
            points[i].rot.x,
            points[i].rot.y,
            points[i].rot.z,
            0,
            false
        );
        await lerpObject(metalID, points[i].pos, 0.01);
        if (i === 1) {
            const newPos = { ...press.pos };
            newPos.z -= 1;
            await lerpObject(pressID, newPos, 0.8);
            alt.emit('play:Sound3DCoords', newPos, 'crush');
            alt.emit(
                'playParticleAtCoords',
                'core',
                'bang_carmetal',
                1000,
                1,
                newPos.x,
                newPos.y,
                newPos.z - 1.6
            );
            isUp = false;
            await new Promise(resolve => {
                alt.setTimeout(async () => {
                    if (!isUp) {
                        await lerpObject(pressID, press.pos, 0.6);
                    }

                    return resolve(true);
                }, 2000);
            });
            continue;
        }
    }

    native.freezeEntityPosition(metalID, false);
    native.setEntityCollision(metalID, true, true);
    alt.nextTick(() => {
        native.activatePhysics(metalID);
    });

    metalCount += 1;
    processing = false;
}

alt.setInterval(async () => {
    const currentInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);
    if (currentInterior !== 250625) {
        if (metalSpawned.length >= 0) {
            metalSpawned.forEach(metalID => {
                native.deleteEntity(metalID);
            });

            metalSpawned = [];
        }

        if (conveyorID) {
            alt.log('Refinery Modifications Despawned');
            native.deleteEntity(conveyorID);
            conveyorID = undefined;
        }

        if (pressID) {
            native.deleteEntity(pressID);
            pressID = undefined;
        }

        hasComeIntoView = false;
        return;
    }

    if (!conveyorID) {
        conveyorID = native.createObjectNoOffset(
            conveyorHash,
            conveyor.pos.x,
            conveyor.pos.y,
            conveyor.pos.z,
            false,
            false,
            false
        );
        native.setEntityRotation(
            conveyorID,
            conveyor.rot.x,
            conveyor.rot.y,
            conveyor.rot.z,
            0,
            0
        );
    }

    if (!pressID) {
        pressID = native.createObjectNoOffset(
            pressHash,
            press.pos.x,
            press.pos.y,
            press.pos.z,
            false,
            false,
            false
        );
        native.setEntityRotation(pressID, press.rot.x, press.rot.y, press.rot.z, 0, 0);
    }

    if (!hasComeIntoView) {
        hasComeIntoView = true;

        if (metalCount >= 1) {
            const lastPoint = points[points.length - 1];
            for (let i = 0; i < metalCount; i++) {
                const newMetal = native.createObjectNoOffset(
                    metalHash,
                    lastPoint.pos.x,
                    lastPoint.pos.y,
                    lastPoint.pos.z,
                    false,
                    false,
                    false
                );
                metalSpawned.push(newMetal);
                native.setEntityRotation(
                    newMetal,
                    lastPoint.rot.x,
                    lastPoint.rot.y,
                    lastPoint.rot.z,
                    0,
                    0
                );
                native.activatePhysics(newMetal);
            }
        }
    }

    spawnMetal();
}, 2000);

alt.onServer('refinery:SpawnMetal', () => {
    metalInQueue += 1;
});

alt.on('metal:Pickup', data => {
    const id = data.id;
    const index = metalSpawned.findIndex(metal => {
        if (metal === id) {
            return metal;
        }
    });

    if (index !== -1) {
        metalSpawned.splice(index, 1);
    }

    native.deleteEntity(id);
    metalCount -= 1;
    alt.emitServer('refinery:PickupMetal');
});
