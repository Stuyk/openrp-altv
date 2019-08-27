import * as alt from 'alt';

let isActive = false;
let webView;

export function toggleDialogue() {
    if (webView === undefined) {
        webView = new alt.WebView('http://resources/orp/client/html/chat/index.html');
        webView.on('routeMessage', routeMessage);
        webView.focus();
        webView.unfocus();
    }

    if (!isActive) {
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
    alt.toggleGameControls(true);
    alt.showCursor(false);
    webView.unfocus();
    isActive = false;

    if (!msg) return;
    if (msg.length <= 0) return;

    alt.emitServer('chat:RouteMessage', msg);
}
