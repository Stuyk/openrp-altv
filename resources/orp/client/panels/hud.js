import * as alt from 'alt';
import * as native from 'natives';
import { showCursor } from '/client/utility/cursor.js';

alt.log('Loaded: client->panels->chat.js');

const url = 'http://resource/client/html/hud/index.html';
let webview;
let contextData = new Map();
let isContextOpen = false;
let lastX;
let lastY;
let weather;

alt.on('view:DestroyAll', () => {
    if (webview) {
        webview.destroy();
    }
});

/*
Warning; this is meant to be a seperate webview.
Do not use 'View' for this view. Chat needs to be
decoupled from everything else.
*/

alt.on('meta:Changed', turnOnHud);

function turnOnHud(key, value) {
    if (key !== 'loggedin') return;
    alt.off('meta:Changed', turnOnHud);
    showDialogue();
}

function showDialogue() {
    if (webview === undefined) {
        webview = new alt.WebView(url);
        webview.on('context:Click', contextClick);
        webview.on('hud:Ready', ready);
        webview.unfocus();
    }
}

function ready() {
    webview.emit('hud:SetWeather', weather);
}

function contextClick(isServer, eventName, hash) {
    const data = contextData.get(hash);
    alt.log(JSON.stringify(data));

    if (isServer) {
        alt.emitServer(eventName, data);
    } else {
        alt.emit(eventName, data);
    }

    isContextOpen = false;
}

export function appendContextItem(name, isServer, eventName, data) {
    if (!webview) return;
    const hash = JSON.stringify(data) + name + isServer + eventName;

    contextData.set(hash, data);
    webview.emit('context:AppendContextItem', name, isServer, eventName, hash);
}

export function setContextTitle(title, useLastPos = false) {
    if (!webview) return;
    isContextOpen = true;
    const [_, width, height] = native.getActiveScreenResolution(0, 0);

    if (!useLastPos) {
        lastX = width * native.getControlNormal(0, 239);
        lastY = height * native.getControlNormal(0, 240);
    }

    webview.emit('context:SetContextTitle', title);
    webview.emit('context:SetContextPosition', lastX, lastY);
    webview.focus();
}

alt.on('hud:ContextClose', () => {
    if (!webview) return;
    webview.emit('context:CloseContext');
    webview.unfocus();

    if (isContextOpen) {
        isContextOpen = false;
    }
});

alt.on('hud:SetKeyValue', (key, value) => {
    if (!webview) return;
    webview.emit('hud:SetHudData', key, value);
});

alt.on('hud:AdjustHud', value => {
    if (!webview) return;
    webview.emit('hud:AdjustHud', value);
});

alt.on('hud:Hide', value => {
    if (!webview) return;

    if (value) {
        native.displayRadar(false);
    } else {
        native.displayRadar(true);
    }

    webview.emit('hud:Hide', value);
});

alt.on('hud:IsInVehicle', value => {
    if (!webview) return;
    webview.emit('hud:isInVehicle', value);
});

alt.on('meta:Changed', (key, value) => {
    if (!webview) return;
    if (key === 'cash') {
        webview.emit('hud:SetHudData', 'cash', value);
    }

    if (key === 'queueNotification') {
        alt.emit('play:Sound', 'notification', 0.5, 0.1);
        webview.emit('hud:QueueNotification', value);
    }

    if (key === 'hudNotice') {
        webview.emit('hud:SetHudNotice', value);
    }
});

alt.on('hud:QueueNotification', msg => {
    if (!webview) return;
    webview.emit('hud:QueueNotification', msg);
    alt.emit('play:Sound', 'notification', 0.5, 0.1);
});

alt.on('hud:UpdateWeather', weatherName => {
    if (!webview) return;
    weather = weatherName;
    webview.emit('hud:SetWeather', weatherName);
});

alt.on('hud:SetPvpZone', toggle => {
    if (!webview) return;
    webview.emit('hud:SetPvpZone', toggle);
});
