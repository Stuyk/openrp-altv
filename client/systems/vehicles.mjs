import * as alt from 'alt';
import * as native from 'natives';
import * as utilityText from 'client/utility/text.mjs';

const vehicleDoorsToShow = [
    {
        name: 'handle_dside_f',
        message: 'Door',
        id: 0,
        seat: 'seat_dside_f',
        seatID: -1
    },
    {
        name: 'handle_pside_f',
        message: 'Door',
        id: 1,
        seat: 'seat_pside_f',
        seatID: 0
    },
    {
        name: 'handle_dside_r',
        message: 'Door',
        id: 2,
        seat: 'seat_dside_r',
        seatID: 1
    },
    {
        name: 'handle_pside_r',
        message: 'Door',
        id: 3,
        seat: 'seat_pside_r',
        seatID: 2
    },
    { name: 'engine', message: 'Hood', id: 4 },
    { name: 'boot', message: 'Trunk', id: 5 } // Why is it called a boot? Idk. Rockstar is fucking weird and called it a fucking boot. But it's a god damn trunk and that's why we don't listen to Rockstar.
];

let closestVehicle;
let closestPosition;
let foundVehicle = false;
let cooldown = false;
let isPlayerTooFar = false;

export function engineOn(vehicle) {
    native.setVehicleUndriveable(vehicle.scriptID, false);
    native.setVehicleEngineOn(vehicle.scriptID, true, false, false);
}

export function engineOff(vehicle) {
    native.setVehicleEngineOn(vehicle.scriptID, false, false, false);
    native.setVehicleUndriveable(vehicle.scriptID, true);
}

export function openDoor(vehicle, id) {
    if (native.getVehicleClass(vehicle.scriptID) === 7 && id >= 4) return;

    native.setVehicleDoorOpen(vehicle.scriptID, id, false, false);

    let data = vehicleDoorsToShow.find(x => x.id === id);

    if (data) {
        vehicle.setMeta(data.name, true);
        alt.log('set door to true');
    }
}

export function closeDoor(vehicle, id) {
    if (native.getVehicleClass(vehicle.scriptID) === 7 && id >= 4) return;

    native.setVehicleDoorShut(vehicle.scriptID, id, false);

    let data = vehicleDoorsToShow.find(x => x.id === id);

    if (data) {
        vehicle.setMeta(data.name, false);
        alt.log('set door to false');
    }
}

export function shutAllDoors(vehicle) {
    native.setVehicleDoorsShut(vehicle.scriptID, false);
}

// Look for the closest vehicle to the player.
alt.setInterval(() => {
    // Get player position and forward vector.
    let pos = alt.Player.local.pos;
    let fv = native.getEntityForwardVector(alt.Player.local.scriptID);

    // Ray cast from top to bottom.
    let found = false;
    for (let i = 1; i < 5; i++) {
        let posFront = {
            x: pos.x + fv.x * 7,
            y: pos.y + fv.y * 7,
            z: pos.z - i * 0.1
        };

        let testResult = native.startShapeTestRay(
            pos.x,
            pos.y,
            pos.z,
            posFront.x,
            posFront.y,
            posFront.z,
            2,
            alt.Player.local.scriptID,
            0
        );

        let [
            _idk,
            _hit,
            _endCoords,
            _surfaceNormal,
            _entity
        ] = native.getShapeTestResult(
            testResult,
            undefined,
            undefined,
            undefined,
            undefined
        );

        if (_hit) {
            found = true;
            closestVehicle = alt.Vehicle.all.find(v => v.scriptID === _entity);
            closestPosition = _endCoords;

            if (distance(closestPosition, alt.Player.local.pos) > 2) {
                isPlayerTooFar = true;
            } else {
                isPlayerTooFar = false;
            }
            break;
        }
    }

    // int GET_SHAPE_TEST_RESULT(int rayHandle, BOOL *hit, Vector3 *endCoords, Vector3 *surfaceNormal, Entity *entityHit)

    if (!found) {
        alt.off('update', showVehicleOptions);
        foundVehicle = false;
        return;
    }

    // Ensure we don't create this update event twice for new reason.
    if (foundVehicle) return;

    // Turn on the showVehicleOptions draw.
    foundVehicle = true;
    alt.on('update', showVehicleOptions);
}, 500);

function distance(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) +
            Math.pow(vector1.y - vector2.y, 2) +
            Math.pow(vector1.z - vector2.z, 2)
    );
}

function showVehicleOptions() {
    if (!foundVehicle || !closestVehicle) return;

    /*
    if (alt.Player.local.vehicle === closestVehicle) {
        if (
            alt.Player.local.scriptID !==
            native.getPedInVehicleSeat(closestVehicle.scriptID, -1)
        )
            return;

        if (!native.getIsVehicleEngineRunning(closestVehicle.scriptID)) {
            native.beginTextCommandDisplayHelp('STRING');
            native.addTextComponentSubstringPlayerName(
                `Press ~INPUT_CONTEXT~ to turn your engine on and off.`
            );
            native.endTextCommandDisplayHelp(0, false, true, -1);

            if (native.isControlJustPressed(0, 38)) {
                if (cooldown) return;

                cooldown = true;
                alt.emitServer('vehicle:EngineOn');

                alt.setTimeout(() => {
                    cooldown = false;
                }, 100);
            }

            return;
        }

        if (native.isControlJustPressed(0, 38)) {
            if (cooldown) return;

            alt.log('pressed');
            cooldown = true;
            alt.emitServer('vehicle:EngineOff');

            alt.setTimeout(() => {
                cooldown = false;
            }, 100);
        }
        return;
    }
    */

    const data = getVehicleDraw(closestVehicle);

    if (data === undefined) return;

    if (isPlayerTooFar) {
        data.message = 'Toggle Lock';
    }
    // Draw the Data we found.
    utilityText.drawText3d(
        data.message,
        data.pos.x,
        data.pos.y,
        data.pos.z,
        0.4,
        4,
        255,
        255,
        255,
        255,
        true,
        true,
        99
    );

    showHelpText(`Press ~INPUT_CONTEXT~ to ${data.message}`);

    // When 'E' is pressed.
    if (native.isControlJustPressed(0, 38)) {
        // Setup a Cooldown
        if (cooldown) return;
        cooldown = true;

        if (data.isSeat) {
            native.taskEnterVehicle(
                alt.Player.local.scriptID,
                closestVehicle.scriptID,
                1500,
                data.id,
                2.0,
                1,
                0
            );
            alt.setTimeout(() => {
                alt.emitServer(
                    'vehicle:ToggleDoor',
                    closestVehicle,
                    data.doorID
                );
            }, 1500);
        } else {
            if (!isPlayerTooFar) {
                if (
                    native.getVehicleDoorLockStatus(closestVehicle.scriptID) ===
                    2
                ) {
                    native.clearPedTasksImmediately(alt.Player.local.scriptID);
                } else {
                    native.taskOpenVehicleDoor(
                        alt.Player.local.scriptID,
                        closestVehicle.scriptID,
                        1500,
                        data.id,
                        1
                    );

                    alt.emitServer(
                        'vehicle:ToggleDoor',
                        closestVehicle,
                        data.id
                    );
                }
            } else {
                alt.emitServer('vehicle:LockAllDoors', closestVehicle, data.id);
            }
        }

        alt.setTimeout(() => {
            cooldown = false;
        }, 150);
    }
}

export function honkHorn(veh, times, duration) {
    let honkCount = 0;
    let interval = alt.setInterval(() => {
        native.startVehicleHorn(
            veh.scriptID,
            duration / 2,
            native.getHashKey('HELDDOWN'),
            false
        );
        honkCount += 1;

        if (honkCount >= times) {
            alt.clearInterval(interval);
        }
    }, duration);
}

function getVehicleDraw(veh) {
    const vehClass = native.getVehicleClass(veh.scriptID);
    const pPos = closestPosition;
    let currentDoor;
    let distanceToDoor = 20;

    // Loop through each
    for (let key in vehicleDoorsToShow) {
        let doorID = vehicleDoorsToShow[key].id;
        let doorName = vehicleDoorsToShow[key].name;
        let seatID = vehicleDoorsToShow[key].seatID;
        let seatName = vehicleDoorsToShow[key].seat;
        let doorMessage = vehicleDoorsToShow[key].message;

        // if the vehicle is super class & is a trunk or hood.
        // Don't show options. They don't work right.
        if (doorID >= 4 && vehClass === 7) continue;

        // If the vehicle door is open.
        // Don't handle TRUNKS for SEATS.
        if (veh.getMeta(vehicleDoorsToShow[key].name) && doorID <= 3) {
            let seatPos = getEntityBone(veh, seatName);
            let seatDistance = distance(seatPos, pPos);

            if (seatDistance < distanceToDoor) {
                distanceToDoor = seatDistance;
                currentDoor = {
                    message: 'Sit',
                    pos: seatPos,
                    id: seatID,
                    isSeat: true,
                    dist: distanceToDoor,
                    doorID
                };
            }
        }

        let doorPos = getEntityBone(veh, doorName);
        let doorDistance = distance(doorPos, pPos);

        if (doorDistance > distanceToDoor) continue;

        distanceToDoor = doorDistance;
        currentDoor = {
            message: doorMessage,
            pos: doorPos,
            id: doorID,
            dist: distanceToDoor
        };
        continue;
    }

    return currentDoor;
}

function getEntityBone(entity, bonename) {
    return native.getWorldPositionOfEntityBone(
        entity.scriptID,
        native.getEntityBoneIndexByName(entity.scriptID, bonename)
    );
}

function showHelpText(message) {
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandDisplayHelp(0, false, true, -1);
}
