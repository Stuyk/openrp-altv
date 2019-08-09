import * as alt from 'alt';
import * as native from 'natives';

// Registration Webview; Shows on Client Start
var registerWebview = new alt.WebView(
    'http://resources/orp/client/html/registration/index.html'
);

// Focus the webview; enable the cursor.
registerWebview.focus(); // Focus the Window
registerWebview.emit('ready');
alt.showCursor(true); // Show Cursor for Window
alt.toggleGameControls(false); // Freeze player controls.

// Called when a new user wants to register an account.
registerWebview.on('registerAccount', (username, password) => {
    alt.log(`${username} ${password}`);
    alt.emitServer('register', username, password);
});

// Called when an existing user wants to log in.
registerWebview.on('existingAccount', (username, password) => {
    alt.emitServer('existing', username, password);
    alt.log(`${username} ${password}`);
});

// Called when there's an error/alert in the registration.
alt.onServer('registerEvent', registerEventError);
alt.onServer('registerEventSuccess', registerEventSuccess);

// Finish the login; and disable un-necessary events.
alt.onServer('finishLogin', () => {
    alt.toggleGameControls(true);
    alt.showCursor(false);
    registerWebview.unfocus();
    registerWebview.destroy();
    alt.offServer('registerEvent', registerEventError);
});

// Send error message to the registerWebview.
function registerEventError(errorMessage) {
    registerWebview.emit('error', errorMessage);
}

function registerEventSuccess(successMessage) {
    registerWebview.emit('success', successMessage);
}
