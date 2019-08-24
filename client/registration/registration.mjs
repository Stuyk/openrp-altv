import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->registration->registration.mjs');

const urlForView = 'http://resources/orp/client/html/registration/index.html';
let registerWebview = undefined;
let loginCamera = undefined;

let lastTriedUsername = null;

/**
 * Show the login camera to the local player.
 * @param regCamCoord Coordinate of the login camera.
 * @param regCamPointAtCoord Coordinate to point the login camera at.
 */
export function showDialogue(regCamCoord, regCamPointAtCoord) {
    // Show the WebPage for Registration / Login
    registerWebview = new alt.WebView(urlForView);
    registerWebview.focus(); // Focus on the page.
    alt.showCursor(true); // Show the cursor / mouse.
    alt.toggleGameControls(false); // Turn off player controls.
    native.displayRadar(false); // Turn off radar.

    // Setup the login camera.
    loginCamera = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        regCamCoord.x,
        regCamCoord.y,
        regCamCoord.z + 10,
        0,
        0,
        0,
        90,
        true,
        0
    );

    // Point the login camera at the coordinate.
    native.pointCamAtCoord(
        loginCamera,
        regCamPointAtCoord.x,
        regCamPointAtCoord.y,
        regCamPointAtCoord.z
    );

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);
    native.transitionToBlurred(1000);

    registerWebview.on('ready', () => {
        const lastUsername = alt.LocalStorage.get().get("lastUsername");
        if (lastUsername != null)
            registerWebview.emit('setUsername', lastUsername);
    });

    // Called when a new user wants to register an account.
    registerWebview.on('registerAccount', registerAccount);

    // Called when an existing user wants to log in.
    registerWebview.on('existingAccount', existingAccount);
}

function existingAccount(username, password, remember) {
    if (remember)
        lastTriedUsername = username;
    alt.emitServer('register:ExistingAccount', username, password);
}

function registerAccount(username, password) {
    alt.emitServer('register:NewAccount', username, password);
}

// Called when login is complete.
export function closeDialogue() {
    loginCamera = undefined;
    native.destroyAllCams(true);
    native.displayRadar(true);
    native.renderScriptCams(false, false, 0, false, false);
    native.transitionFromBlurred(3000);
    alt.toggleGameControls(true);
    alt.showCursor(false);
    registerWebview.unfocus();
    registerWebview.off('registerAccount', registerAccount);
    registerWebview.off('existingAccount', existingAccount);

    registerWebview.destroy();
    alt.offServer('register:ShowDialogue', showDialogue);
    alt.offServer('register:ShowError', showError);
    alt.offServer('register:ShowSuccess', showSuccess);
    alt.offServer('register:CloseDialogue', closeDialogue);
}

// Send error message to the registerWebview.
export function showError(errorMessage) {
    registerWebview.emit('error', errorMessage);
}

// Send a success message when the login is successful.
export function showSuccess(successMessage) {
    registerWebview.emit('success', successMessage);
    if (lastTriedUsername != null) {
        const cache = alt.LocalStorage.get();
        cache.set('lastUsername', lastTriedUsername);
        cache.save();
    }
}

// Auto-switch to login panel.
export function showLogin() {
    registerWebview.emit('goToLogin');
}
