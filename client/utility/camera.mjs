import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->utility->camera.mjs');

export class Camera {
    constructor(pos, fov) {
        const args = native.getActiveScreenResolution(0, 0);

        this.cam = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            pos.x,
            pos.y,
            pos.z,
            0,
            0,
            0,
            fov,
            true,
            0
        );

        this.cameraHeight = 0;
        this.screenWidth = args[1];
        this.screenHeight = args[2];
        this.target = undefined;
    }

    fov(value) {
        native.setCamFov(this.cam, value);
        native.renderScriptCams(true, false, 0, true, false);
    }

    pointAtBone(entity, bone, xOffset, yOffset, zOffset) {
        native.pointCamAtPedBone(
            this.cam,
            entity,
            bone,
            xOffset,
            yOffset,
            zOffset,
            false
        );
        native.renderScriptCams(true, false, 0, true, false);
    }

    pointAtEntity(entity, xOffset, yOffset, zOffset) {
        native.pointCamAtEntity(this.cam, entity, xOffset, yOffset, zOffset, false);
        native.renderScriptCams(true, false, 0, true, false);
    }

    pointAtCoord(pos) {
        native.pointCamAtCoord(this.cam, pos.x, pos.y, pos.z);
        native.renderScriptCams(true, false, 0, true, false);
    }

    position(x, y, z) {
        native.setCamCoord(this.cam, x, y, z);
        native.renderScriptCams(true, false, 0, true, false);
    }

    rotate(pitch, roll, yaw) {
        native.setCamRot(this.cam, pitch, roll, yaw, 0);
        native.renderScriptCams(true, false, 0, true, false);
    }

    unrender() {
        native.renderScriptCams(false, false, 0, false, false);
    }

    render() {
        native.renderScriptCams(true, false, 0, true, false);
    }

    destroy() {
        for (let i = 0; i < 25; i++) {
            native.destroyAllCams(true);
            native.renderScriptCams(false, false, 0, false, false);
        }

        if (this.interval !== undefined) {
            alt.clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    playerControlsEntity(ent, noWASD = false) {
        this.target = ent;
        this.noWASD = noWASD;

        if (this.interval !== undefined) {
            alt.clearInterval(this.interval);
            this.interval = undefined;
        }

        this.playerControlFunction = this.playerControls.bind(this);
        this.interval = alt.setInterval(this.playerControlFunction, 5);
    }

    // Call in update function.
    playerControls() {
        native.disableAllControlActions(0);
        native.disableAllControlActions(1);
        let mX = alt.getCursorPos().x;
        let fov = native.getCamFov(this.cam);
        let coord = native.getCamCoord(this.cam);

        // Scroll to zoom in.
        if (native.isDisabledControlPressed(0, 14)) {
            if (mX < this.screenWidth / 4) return;
            fov += 3;
            if (fov >= 100) fov = 100;
            this.fov(fov);
        }

        // Scroll to zoom out
        if (native.isDisabledControlPressed(0, 15)) {
            if (mX < this.screenWidth / 4) return;

            fov -= 3;
            if (fov <= 20) fov = 20;
            this.fov(fov);
        }

        // Right-Click
        if (native.isDisabledControlPressed(0, 25)) {
            let heading = native.getEntityHeading(this.target);

            if (mX < this.screenWidth / 2) {
                native.setEntityHeading(this.target, heading - 1.5);
            } else {
                native.setEntityHeading(this.target, heading + 1.5);
            }
        }

        // W
        if (native.isDisabledControlPressed(0, 32) && !this.noWASD) {
            this.cameraHeight += 0.01;
            if (this.cameraHeight > 2) {
                this.position(coord.x, coord.y, coord.z);
            } else {
                this.position(coord.x, coord.y, coord.z + 0.01);
            }
        }

        if (native.isDisabledControlPressed(0, 33) && !this.noWASD) {
            this.cameraHeight -= 0.01;
            if (this.cameraHeight < -0.5) {
                this.position(coord.x, coord.y, coord.z);
            } else {
                this.position(coord.x, coord.y, coord.z - 0.01);
            }
        }
    }
}
