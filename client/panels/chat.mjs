import * as alt from 'alt';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
let isActive = false;
let webView = new alt.WebView('http://resources/orp/client/html/chat/index.html');
webView.on('routeMessage', routeMessage);

export function toggleDialogue() {
    if (webView === undefined) {
        webView.on('routeMessage', routeMessage);
        webView.focus();
        webView.unfocus();
    }

    if (panelsPanelStatus.isAnyPanelOpen()) return;

    if (!isActive) {
        alt.emit('panel:SetStatus', 'chat', true);
        isActive = true;
        webView.focus();
        webView.emit('showChatInput');
        alt.showCursor(true);
        alt.toggleGameControls(false);
    }
}

export function send(msg) {
    webView.emit('appendMessage', msg);
}

function routeMessage(msg) {
    alt.emit('panel:SetStatus', 'chat', false);
    alt.toggleGameControls(true);
    alt.showCursor(false);
    webView.unfocus();
    isActive = false;

    if (!msg) return;
    if (msg.length <= 0) return;

    alt.emitServer('chat:RouteMessage', msg);
}
