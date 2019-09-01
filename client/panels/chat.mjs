import * as alt from 'alt';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
let isActive = false;
let webView;

export function toggleDialogue() {
    if (webView === undefined) {
        webView = new alt.WebView('http://resources/orp/client/html/chat/index.html');
        webView.on('routeMessage', routeMessage);
        webView.focus();
        webView.unfocus();
    }

    if (panelsPanelStatus.isAnyPanelOpen()) return;
    if (!alt.gameControlsEnabled()) return;

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
