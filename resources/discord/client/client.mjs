import * as alt from 'alt';
import * as native from 'natives';

let webview;

alt.onServer('discord:Connect', (endpoint) => {
    webview = new alt.WebView(endpoint);
    webview.focus();
    alt.showCursor(true);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    native.doScreenFadeOut(1);
    native.transitionToBlurred(1);

    webview.on('discord:token', (token) => {
        alt.emitServer('discord:ParseLogin', token);
    });
});

alt.onServer('discord:LoggedIn', () => {
    alt.showCursor(false);
    webview.destroy();
    webview = undefined;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    native.doScreenFadeIn(5000);
    native.transitionFromBlurred(5000);
});
