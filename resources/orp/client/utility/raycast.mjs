import * as alt from 'alt';
import * as native from 'natives';

export function getEntityFromRaycast(flag, ignorePlayer) {
    let pos = alt.Player.local.pos;
    let fv = native.getEntityForwardVector(alt.Player.local.scriptID);

    // Cast multiple raycasts from center-forward to center-downards.
    // Think of a pool noodle pointing down.
    for (let i = 1; i < 5; i++) {
        let posFront = {
            x: pos.x + fv.x * 7,
            y: pos.y + fv.y * 7,
            z: pos.z - i * 0.1
        };

        // Do a ray cast.
        let ray;
        if (ignorePlayer) {
            ray = native.startShapeTestRay(
                pos.x,
                pos.y,
                pos.z,
                posFront.x,
                posFront.y,
                posFront.z,
                flag,
                alt.Player.local.scriptID,
                0
            );
        } else {
            ray = native.startShapeTestRay(
                pos.x,
                pos.y,
                pos.z,
                posFront.x,
                posFront.y,
                posFront.z,
                flag,
                undefined,
                0
            );
        }

        // Get the Result
        // eslint-disable-next-line no-unused-vars
        let [_, _hit, _endCoords, _surfaceNormal, _entity] = native.getShapeTestResult(
            ray
        );

        // Check if the entity was hit.
        if (_hit) {
            // Vehicle Type
            if (flag === 2) {
                return alt.Vehicle.all.find(v => v.scriptID === _entity);
            }

            // Player Type
            if (flag === 4 || flag == 8) {
                return _entity;
            }

            // Return the entityNumber for object.
            if (flag === 16) {
                return _entity;
            }

            // Just the map
            if (flag === 1) {
                return _endCoords;
            }
        }
    }

    return undefined;
}
