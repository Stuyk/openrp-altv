import * as alt from 'alt';

let webview;

alt.onServer('discord:Request', endpoint => {
    webview = new alt.WebView(endpoint);
    webview.focus();
    alt.showCursor(true);
});

alt.onServer('discord:LoggedIn', () => {
    alt.showCursor(false);
    webview.destroy();
    webview = undefined;
});
