import * as alt from 'alt';
import * as native from 'natives';
import * as utilityText from 'client/utility/text.mjs';
import { QuickInteract } from 'client/systems/quickinteract.mjs';

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

// Disable seat shuffle.
alt.on('update', disableSeatShuffle);

const keysBinds = [
    { key: 'Vehicle', message: 'Interactions', func: undefined },
    { key: '1', message: 'Driver Seat', func: enterDriverFront },
    { key: '2', message: 'Passenger Seat', func: enterPassengerFront },
    { key: '3', message: 'Driver Rear Seat', func: enterDriverRear },
    { key: '4', message: 'Passenger Rear Seat', func: enterPassengerRear },
    { key: 'Z', message: 'Toggle Trunk', func: toggleTrunk },
    { key: 'X', message: 'Toggle Hood', func: toggleHood }
];

new QuickInteract(38, keysBinds, 2);

function toggleTrunk(veh) {
    if (veh.getMeta('trunk')) {
        veh.setMeta('trunk', false);
        native.setVehicleDoorShut(veh.scriptID, 5, false);
        return;
    }

    veh.setMeta('trunk', true);
    native.setVehicleDoorOpen(veh.scriptID, 5, false, false);
}

function toggleHood(veh) {
    if (veh.getMeta('hood')) {
        veh.setMeta('hood', false);
        native.setVehicleDoorShut(veh.scriptID, 4, false);
        return;
    }

    veh.setMeta('hood', true);
    native.setVehicleDoorOpen(veh.scriptID, 4, false, false);
}

function enterDriverFront(veh) {
    native.taskEnterVehicle(
        alt.Player.local.scriptID,
        veh.scriptID,
        2000,
        -1,
        2,
        1,
        0
    );

    alt.Player.local.setMeta('seat', -1);
}

function enterDriverRear(veh) {
    native.taskEnterVehicle(
        alt.Player.local.scriptID,
        veh.scriptID,
        2000,
        1,
        2,
        1,
        0
    );

    alt.Player.local.setMeta('seat', -1);
}

function enterPassengerFront(veh) {
    native.taskEnterVehicle(
        alt.Player.local.scriptID,
        veh.scriptID,
        2000,
        0,
        2,
        1,
        0
    );

    alt.Player.local.setMeta('seat', 0);
}

function enterPassengerRear(veh) {
    native.taskEnterVehicle(
        alt.Player.local.scriptID,
        veh.scriptID,
        2000,
        2,
        2,
        1,
        0
    );

    alt.Player.local.setMeta('seat', 2);
}

function disableSeatShuffle() {
    if (!native.isPedInAnyVehicle(alt.Player.local.scriptID, undefined)) return;
    let vehicle = native.getVehiclePedIsIn(
        alt.Player.local.scriptID,
        undefined
    );

    let passenger = native.getPedInVehicleSeat(vehicle, 0);

    if (!native.getIsTaskActive(passenger, 165)) return;

    if (native.isVehicleSeatFree(vehicle, -1)) {
        if (passenger === alt.Player.local.scriptID) {
            native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle, 0);
        }
    }
}
