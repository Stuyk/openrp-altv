import * as alt from 'alt';
import { currentView } from 'client/utility/view.mjs';

let isActive = false;
let webView;
let isViewHidden = false;

export function toggleDialogue() {
    if (webView === undefined) {
        webView = new alt.WebView('http://resource/client/html/chat/index.html');
        webView.on('routeMessage', routeMessage);
        return;
    }

    if (currentView.isFocused()) return;

    if (!isActive) {
        alt.emit('panel:SetStatus', 'chat', true);
        isActive = true;
        webView.focus();
        webView.emit('showChatInput');
        alt.toggleGameControls(false);
        alt.showCursor(true);
    }
}

export function send(msg) {
    if (webView === undefined) return;

    webView.emit('appendMessage', msg);
}

export function hide(value) {
    if (webView === undefined) return;

    isViewHidden = value;

    webView.emit('hide', value);
}

function routeMessage(msg) {
    alt.emit('panel:SetStatus', 'chat', false);
    alt.toggleGameControls(true);
    webView.unfocus();
    isActive = false;

    try {
        alt.showCursor(false);
    } catch (err) {}

    if (!msg) return;
    if (msg.length <= 0) return;

    alt.emitServer('chat:RouteMessage', msg);
}

alt.on('hud:SetCash', cash => {
    if (webView === undefined) return;
    webView.emit('setCash', cash);
});

alt.on('hud:SetLocation', location => {
    if (webView === undefined) return;
    webView.emit('setLocation', location);
});

alt.on('hud:SetSpeed', speed => {
    if (webView === undefined) return;
    webView.emit('setSpeed', speed);
});
