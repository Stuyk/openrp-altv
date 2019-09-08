import * as alt from 'alt';
import * as native from 'natives';
import * as chat from 'client/panels/chat.mjs';
import { View } from 'client/utility/view.mjs';
import { Camera } from 'client/utility/camera.mjs';

alt.log('Loaded: client->panels->registration.mjs');

const url = 'http://resource/client/html/registration/index.html';
let webview = undefined;
let camera;
let lastTriedUsername = null;
let yaw = 0;

export function showDialogue(regCamCoord) {
    webview = new View(url);
    webview.on('registerAccount', registerAccount);
    webview.on('existingAccount', existingAccount);
    webview.on('ready', () => {
        const lastUsername = alt.LocalStorage.get().get('lastUsername');
        if (lastUsername != null) webview.emit('setUsername', lastUsername);
    });

    regCamCoord.z += 150;
    //camera = new Camera(regCamCoord, 90);
    //alt.on('update', rotateCamera);
}

function existingAccount(username, password, remember) {
    if (remember) lastTriedUsername = username;
    alt.emitServer('register:ExistingAccount', username, password);
}

function registerAccount(username, password) {
    alt.emitServer('register:NewAccount', username, password);
}

function rotateCamera() {
    if (camera === undefined) return;

    yaw += 0.01;
    camera.rotate(0, 0, yaw);
}

// Called when login is complete.
export function closeDialogue() {
    alt.off('rotateCamera', rotateCamera);
    //camera.destroy();
    camera = undefined;

    // Close webview
    webview.close();

    // Unregister Events
    alt.offServer('register:ShowDialogue', showDialogue);
    alt.offServer('register:ShowError', showError);
    alt.offServer('register:ShowSuccess', showSuccess);
    alt.offServer('register:CloseDialogue', closeDialogue);

    // Turn on Chat
    chat.toggleDialogue();

    // Set the Registration Panel Status Off
    alt.emit('panel:SetStatus', 'registration', false);
}

// Send error message to the WebView.
export function showError(errorMessage) {
    webview.emit('error', errorMessage);
}

// Send a success message when the login is successful.
export function showSuccess(successMessage) {
    webview.emit('success', successMessage);
    if (lastTriedUsername != null) {
        const cache = alt.LocalStorage.get();
        cache.set('lastUsername', lastTriedUsername);
        cache.save();
    }
}

// Auto-switch to login panel.
export function showLogin() {
    webview.emit('goToLogin');
}
