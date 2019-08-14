import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->registration->registration.mjs');

const urlForView = 'http://resources/orp/client/html/registration/index.html';
let registerWebview = undefined;
let loginCamera = undefined;

/**
 * Show the login camera to the local player.
 * @param regCamCoord Coordinate of the login camera.
 * @param regCamPointAtCoord Coordinate to point the login camera at.
 */
export function registerShowCamera(regCamCoord, regCamPointAtCoord) {
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

    // Called when a new user wants to register an account.
    registerWebview.on('registerAccount', registerAccount);

    // Called when an existing user wants to log in.
    registerWebview.on('existingAccount', existingAccount);
}

function existingAccount(username, password) {
    alt.emitServer('existingAccount', username, password);
}

function registerAccount(username, password) {
    alt.emitServer('registerAccount', username, password);
}

// Called when the
export function finishLogin() {
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
    alt.offServer('registerEvent', registerEventError);
    alt.offServer('registerEventSuccess', registerEventSuccess);
    alt.offServer('registerEventGoToLogin', registerEventGoToLogin);
}

// Send error message to the registerWebview.
export function registerEventError(errorMessage) {
    registerWebview.emit('error', errorMessage);
}

// Send a success message when the login is successful.
export function registerEventSuccess(successMessage) {
    registerWebview.emit('success', successMessage);
}

// Auto-switch to login panel.
export function registerEventGoToLogin() {
    registerWebview.emit('goToLogin');
}
