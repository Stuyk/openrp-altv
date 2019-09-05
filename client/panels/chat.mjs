import * as alt from 'alt';
import * as native from 'natives';
import { currentView } from 'client/utility/view.mjs';

alt.log('Loaded: client->panels->chat.mjs');

const url = 'http://resource/client/html/chat/index.html';
let isActive = false;
let webview;
let isViewHidden = false;

/*
Warning; this is meant to be a seperate webview.
Do not use 'View' for this view. Chat needs to be
decoupled from everything else.
*/

export function toggleDialogue() {
    if (webview === undefined) {
        webview = new alt.WebView(url);
        webview.on('routeMessage', routeMessage);
        return;
    }

    if (currentView.isFocused()) return;

    if (!isActive) {
        alt.emit('panel:SetStatus', 'chat', true);
        isActive = true;
        alt.emit('chat:IsOpen', true);
        webview.focus();
        webview.emit('showChatInput');
        alt.toggleGameControls(false);
        alt.showCursor(true);
    }
}

export function send(msg) {
    if (webview === undefined) return;

    webview.emit('appendMessage', msg);
}

export function toggleHide() {
    if (webview === undefined) return;

    isViewHidden = !isViewHidden;
    webview.emit('hide', isViewHidden);
    native.displayRadar(!isViewHidden);
}

function routeMessage(msg) {
    alt.emit('panel:SetStatus', 'chat', false);
    alt.toggleGameControls(true);
    webview.unfocus();
    isActive = false;
    alt.emit('chat:IsOpen', false);

    try {
        alt.showCursor(false);
    } catch (err) {}

    if (!msg) return;
    if (msg.length <= 0) return;

    alt.emitServer('chat:RouteMessage', msg);
}

alt.on('hud:SetCash', cash => {
    if (webview === undefined) return;
    webview.emit('setCash', cash);
});

alt.on('hud:SetLocation', location => {
    if (webview === undefined) return;
    webview.emit('setLocation', location);
});

alt.on('hud:SetSpeed', speed => {
    if (webview === undefined) return;
    webview.emit('setSpeed', speed);
});
