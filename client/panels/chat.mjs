import * as alt from 'alt';

let isActive = false;
let webView;

export function toggleDialogue() {
    alt.log('called Chat');

    if (webView === undefined) {
        alt.log('setup webview');
        webView = new alt.WebView('http://resources/orp/client/html/chat/index.html');
        webView.on('routeMessage', routeMessage);
        webView.focus();
        webView.unfocus();
    }

    if (!isActive) {
        alt.log('setting to active');
        isActive = true;
        webView.focus();
        webView.emit('showChatInput');
        alt.showCursor(true);
        alt.toggleGameControls(false);
    }
}

function routeMessage(msg) {
    alt.toggleGameControls(true);
    alt.showCursor(false);
    webView.unfocus();
    isActive = false;

    if (!msg) return;
    if (msg.length <= 0) return;

    alt.log(msg);
    alt.emitServer('routeMessage', msg);
    webView.emit('appendMessage', msg);
}
