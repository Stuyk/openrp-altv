import * as alt from 'alt';
import * as native from 'natives';

export class Camera {
    constructor(pos, fov) {
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
        native.destroyAllCams(true);
        native.renderScriptCams(false, false, 0, false, false);
    }
}
