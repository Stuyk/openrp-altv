import * as alt from 'alt';
import * as native from 'natives';

let webview;

alt.onServer('discord:Connect', endpoint => {
    webview = new alt.WebView(endpoint);
    webview.focus();
    alt.showCursor(true);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    native.doScreenFadeOut(1);
    native.transitionToBlurred(1);
    webview.on('discord:Token', forwardToken);
});

alt.onServer('discord:LoggedIn', () => {
    alt.showCursor(false);
    webview.off('discord:Token', forwardToken);
    webview.destroy();
    webview = undefined;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    native.doScreenFadeIn(5000);
    native.transitionFromBlurred(5000);
});

function forwardToken(token) {
    if (!token) {
        alt.emitServer('discord:Kick');
        return;
    }
    alt.emitServer('discord:Authorize', token);
}
