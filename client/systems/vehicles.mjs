import * as alt from 'alt';
import * as native from 'natives';
import * as utilityText from 'client/utility/text.mjs';

const vehicleDoorsToShow = [
    {
        name: 'handle_dside_f',
        message: 'Open Door',
        id: 0,
        seat: 'seat_dside_f',
        seatID: -1
    },
    {
        name: 'handle_pside_f',
        message: 'Open Door',
        id: 1,
        seat: 'seat_pside_f',
        seatID: 0
    },
    {
        name: 'handle_dside_r',
        message: 'Open Door',
        id: 2,
        seat: 'seat_dside_r',
        seatID: 1
    },
    {
        name: 'handle_pside_r',
        message: 'Open Door',
        id: 3,
        seat: 'seat_pside_r',
        seatID: 2
    },
    { name: 'engine', message: 'Open Hood', id: 4 },
    { name: 'boot', message: 'Open Trunk', id: 5 } // Why is it called a boot? Idk. Rockstar is fucking weird and called it a fucking boot. But it's a god damn trunk and that's why we don't listen to Rockstar.
];

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

let closestVehicle;
let cooldown = false;

alt.setInterval(() => {
    let pos = alt.Player.local.pos;
    let foundOne = false;

    alt.Vehicle.all.forEach(veh => {
        if (distance(pos, veh.pos) <= 5) {
            foundOne = true;

            if (closestVehicle === veh) return;

            closestVehicle = veh;
            alt.on('update', drawVehicleText);
            alt.log('Found Vehicle');
        }
    });

    if (!foundOne) {
        closestVehicle = undefined;
        alt.off('update', drawVehicleText);
    }
}, 1000);

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

function drawVehicleText() {
    if (!closestVehicle) return;

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

    const positions = [];
    vehicleDoorsToShow.forEach(door => {
        if (
            door.id >= 4 &&
            native.getVehicleClass(closestVehicle.scriptID) === 7
        )
            return;

        if (closestVehicle.getMeta(door.name)) {
            let doorPos = native.getWorldPositionOfEntityBone(
                closestVehicle.scriptID,
                native.getEntityBoneIndexByName(
                    closestVehicle.scriptID,
                    door.seat
                )
            );

            positions.push({
                message: 'Sit',
                pos: doorPos,
                id: door.seatID,
                isSeat: true
            });
        }

        let pos = native.getWorldPositionOfEntityBone(
            closestVehicle.scriptID,
            native.getEntityBoneIndexByName(closestVehicle.scriptID, door.name)
        );

        positions.push({ message: door.message, pos, id: door.id });
    });

    let closestDistance;
    let closest;
    positions.forEach(data => {
        let currDist = distance(alt.Player.local.pos, data.pos);

        if (!closest) {
            closest = data;
            closestDistance = currDist;
            return;
        }

        if (currDist < closestDistance) {
            closest = data;
            closestDistance = currDist;
        }
    });

    utilityText.drawText3d(
        closest.message,
        closest.pos.x,
        closest.pos.y,
        closest.pos.z,
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

    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(
        `Press ~INPUT_CONTEXT~ to ${closest.message}`
    );
    native.endTextCommandDisplayHelp(0, false, true, -1);

    if (native.isControlJustPressed(0, 38)) {
        if (cooldown) return;

        cooldown = true;

        if (closest.isSeat) {
            native.taskEnterVehicle(
                alt.Player.local.scriptID,
                closestVehicle.scriptID,
                5000,
                closest.id,
                2.0,
                1,
                0
            );
        } else {
            alt.emitServer('vehicle:ToggleDoor', closestVehicle, closest.id);
        }

        alt.setTimeout(() => {
            cooldown = false;
        }, 100);
    }
}
