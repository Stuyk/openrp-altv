import * as alt from 'alt';
import * as native from 'natives';

// Interiors
import * as interiors from 'client/interiors/loadinteriors.mjs';

// Customizers
import * as facialCustomizer from 'client/customizers/character.mjs';

// Update Events
import * as onDisconnect from 'client/events/onDisconnect.mjs';
import * as onFacialUpdate from 'client/events/onFacialUpdate.mjs';

// Where the gameplay camera starts.
const startingCamPoint = {
    x: -443.31427001953125,
    y: 1059.4945068359375,
    z: 327.6732177734375
};

// Where the camera points.
const pointDirection = {
    x: -683.2615356445312,
    y: 251.98681640625,
    z: 81.3121337890625
};

// Registration Webview; Shows on Client Start
let registerWebview = new alt.WebView(
    'http://resources/orp/client/html/registration/index.html'
);

let loginCamera = undefined;

// First function that is executed in this script.
// Draws the camera, the webview, etc.
onFirstJoin();

// Called immediately when the player joins the server.
function onFirstJoin() {
    // Focus the webview; enable the cursor.
    registerWebview.focus(); // Focus the Window
    registerWebview.emit('ready');
    alt.showCursor(true); // Show Cursor for Window
    alt.toggleGameControls(false); // Freeze player controls.
    native.displayRadar(false); // Turn off the radar.

    // Setup the login camera.
    loginCamera = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        startingCamPoint.x,
        startingCamPoint.y,
        startingCamPoint.z + 10,
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
        pointDirection.x,
        pointDirection.y,
        pointDirection.z
    );

    // Render the now setup camera; to the player.
    native.renderScriptCams(true, false, 0, true, false);
    native.transitionToBlurred(1000);
}

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
    loginCamera = undefined;
    native.destroyAllCams(true);
    native.displayRadar(true);
    native.renderScriptCams(false, false, 0, false, false);
    native.transitionFromBlurred(3000);
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

// Send a success message when the login is successful.
function registerEventSuccess(successMessage) {
    registerWebview.emit('success', successMessage);
}

alt.onServer('tpw', tpToWaypoint);

// Temporary Waypoint TP
function tpToWaypoint() {
    let waypoint = native.getFirstBlipInfoId(8);

    if (native.doesBlipExist(waypoint)) {
        let coords = native.getBlipInfoIdCoord(waypoint);

        let [_found, _res] = native.getGroundZFor3dCoord(
            coords.x,
            coords.y,
            coords.z + 100,
            undefined,
            undefined
        );

        coords.z = _res + 1;
        alt.log(_found);
        alt.log(_res);

        alt.emitServer('tpToWaypoint', coords);
    }
}

alt.on('keydown', key => {
    if (key === 'O'.charCodeAt(0)) {
        alt.emitServer('requestFaceCustomizer');
    }
});
