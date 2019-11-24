import * as alt from 'alt';
import * as native from 'natives';

let camera;
let endCam;

alt.onServer('camera:SetupSky', pos => {
    camera = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        pos.x,
        pos.y,
        pos.z + 500,
        0,
        0,
        0,
        90,
        true,
        0
    );

    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, false, false, 0);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
});

alt.onServer('camera:FinishSky', () => {
    alt.setTimeout(() => {
        const pos = alt.Player.local.pos;
        endCam = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            pos.x,
            pos.y,
            pos.z,
            0,
            0,
            0,
            90,
            true,
            0
        );

        native.pointCamAtEntity(endCam, alt.Player.local.scriptID, 0, 0, 0, false);
        native.setCamActiveWithInterp(endCam, camera, 2000, 5000, 5000);
        native.renderScriptCams(true, true, 2000, false, false, 0);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        native.clearPedTasks(alt.Player.local.scriptID);
        alt.setTimeout(() => {
            native.destroyAllCams(true);
            native.renderScriptCams(false, 0, 0, false, false, 0);
        }, 2000);
    }, 1000);
});
