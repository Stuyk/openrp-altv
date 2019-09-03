import * as alt from 'alt';
import * as native from 'natives';
import * as chat from 'client/panels/chat.mjs';

alt.log('Loaded: client->registration->registration.mjs');

const url = 'http://resources/orp/client/html/registration/index.html';
let WebView = undefined;
let cam = undefined;
let lastTriedUsername = null;
let yaw = 0;

export function showDialogue(regCamCoord) {
    WebView = new alt.WebView(url);
    WebView.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);
    native.displayRadar(false);

    alt.log('called');

    // Prevents additional panels from showing up.
    alt.emit('panel:SetStatus', 'registration', true);

    // Setup the login camera.
    cam = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        regCamCoord.x,
        regCamCoord.y,
        regCamCoord.z + 200,
        0,
        0,
        0,
        90,
        true,
        0
    );

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);

    // Called when a new user wants to register an account.
    WebView.on('registerAccount', registerAccount);

    // Called when an existing user wants to log in.
    WebView.on('existingAccount', existingAccount);

    // Get last username the player used.
    WebView.on('ready', () => {
        const lastUsername = alt.LocalStorage.get().get('lastUsername');
        if (lastUsername != null) WebView.emit('setUsername', lastUsername);
    });

    alt.on('update', rotateCamera);
}

function existingAccount(username, password, remember) {
    if (remember) lastTriedUsername = username;
    alt.emitServer('register:ExistingAccount', username, password);
}

function registerAccount(username, password) {
    alt.emitServer('register:NewAccount', username, password);
}

function rotateCamera() {
    if (cam === undefined) return;

    yaw += 0.01;
    native.setCamRot(cam, 0, 0, yaw, 0);
}

// Called when login is complete.
export function closeDialogue() {
    cam = undefined;
    native.displayRadar(true);

    // Destroy Camera
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false);

    // Toggle Cursor; Show Controls
    alt.toggleGameControls(true);
    alt.showCursor(false);

    // Kill WebView, Unregister Webview Events
    WebView.unfocus();
    WebView.off('registerAccount', registerAccount);
    WebView.off('existingAccount', existingAccount);
    WebView.destroy();

    // Unregister Events
    alt.offServer('register:ShowDialogue', showDialogue);
    alt.offServer('register:ShowError', showError);
    alt.offServer('register:ShowSuccess', showSuccess);
    alt.offServer('register:CloseDialogue', closeDialogue);
    alt.off('rotateCamera', rotateCamera);

    // Turn on Chat
    chat.toggleDialogue();

    // Set the Registration Panel Status Off
    alt.emit('panel:SetStatus', 'registration', false);
}

// Send error message to the WebView.
export function showError(errorMessage) {
    WebView.emit('error', errorMessage);
}

// Send a success message when the login is successful.
export function showSuccess(successMessage) {
    WebView.emit('success', successMessage);
    if (lastTriedUsername != null) {
        const cache = alt.LocalStorage.get();
        cache.set('lastUsername', lastTriedUsername);
        cache.save();
    }
}

// Auto-switch to login panel.
export function showLogin() {
    WebView.emit('goToLogin');
}
