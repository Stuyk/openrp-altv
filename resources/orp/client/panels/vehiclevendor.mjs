import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.mjs';
import { Vehicles } from '/client/gamedata/vehicles.mjs';
import { Camera } from '/client/utility/camera.mjs';

const vehiclePos = {
    x: -43.35280990600586,
    y: -1095.1534423828125,
    z: 26.42232894897461
};
const camPos = { x: -45.453521728515625, y: -1100.82958984375, z: 27.42232894897461 };

const url = 'http://resource/client/html/vehiclevendor/index.html';
let webview;
let camera;
let currentVehicle;
let currentVehicles = [];
let type = '';

export function showDialogue(vehicleClassType = 'Sedans') {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('vehvendor:Ready', ready);
    webview.on('vehvendor:ChangeIndex', changeIndex);
    webview.on('vehvendor:Purchase', purchase);
    webview.on('vehvendor:Exit', exit);
    webview.on('vehvendor:CurrentVehicles', setCurrentVehicles);
    webview.on('vehvendor:ChangeRotation', rotate);
    type = vehicleClassType;
    camera = new Camera(camPos, 70);
}

function ready() {
    if (!webview) return;
    webview.emit('vehiclevendor:SetVehicleClassType', type);
    webview.emit('vehiclevendor:SetVehicleData', JSON.stringify(Vehicles));

    alt.emitServer('fetch:VehiclePrices');
    changeIndex(0);
}

function rotate(value) {
    if (!webview) return;
    if (!currentVehicle) return;
    native.setEntityHeading(currentVehicle, value);
}

function changeIndex(index, heading = 0) {
    if (!webview) return;
    if (!currentVehicles[index]) return;
    if (currentVehicle) {
        native.deleteEntity(currentVehicle);
    }

    const hash = native.getHashKey(currentVehicles[index].name);
    native.requestModel(hash);
    alt.loadModel(hash);

    currentVehicle = native.createVehicle(
        hash,
        vehiclePos.x,
        vehiclePos.y,
        vehiclePos.z,
        0,
        false,
        false,
        false
    );

    alt.nextTick(() => {
        native.setEntityHeading(currentVehicle, heading);
        native.setVehicleEngineOn(currentVehicle, true, false, false);
        camera.pointAtEntity(currentVehicle, 0, 0, 0);
    });
}

function purchase(name) {
    if (!webview) return;
    if (currentVehicle) {
        native.deleteEntity(currentVehicle);
        currentVehicle = undefined;
        currentVehicles = [];
    }

    if (camera) {
        camera.destroy();
        camera = undefined;
    }

    webview.close();
    alt.emitServer('vehiclevendor:Purchase', name);
}

function exit() {
    if (!webview) return;
    webview.close();

    if (currentVehicle) {
        native.deleteEntity(currentVehicle);
        currentVehicle = undefined;
        currentVehicles = [];
    }

    if (camera) {
        camera.destroy();
        camera = undefined;
    }

    webview.close();
}

function setCurrentVehicles(vehs) {
    currentVehicles = vehs;
}

alt.on('consoleCommand', (cmd, ...args) => {
    if (cmd === 'test') {
        showDialogue(args[0]);
    }
});

alt.onServer('return:VehiclePrices', prices => {
    if (!webview) return;
    webview.emit('vehiclevendor:SetVehiclePrices', prices);
});
