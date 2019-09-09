import * as alt from 'alt';
import * as native from 'natives';
import * as utilityText from 'client/utility/text.mjs';

alt.log('Loaded: client->systems->quickinteract.mjs');

/* What this needs to do:
 * Supports a list of keys the developer sends in.
 * The supported keys are function bound.
 * Can support raycasting; or ANY default colshape
 * interaction event with special params.
 */

// Keybinds Example:
// [{key: 'Q', message:'Toggle Trunk', func: toggleTrunk}]

// 1: Intersect with map
// 2: Intersect with vehicles (used to be mission entities?) (includes train)
// 4: Intersect with peds? (same as 8)
// 8: Intersect with peds? (same as 4)
// 16: Intersect with objects
// 32: Unknown
// 64: Unknown
// 128: Unknown
// 256: Intersect with vegetation (plants, coral. trees not included)
const interactions = [];
let currentInteraction = undefined;

export class QuickInteract {
    constructor(
        inputKey,
        keyBinds,
        entityFlagType = 0,
        isRaycast = true,
        ignorePlayer = true
    ) {
        this.key = inputKey;
        this.keyBinds = keyBinds;
        this.flag = entityFlagType;
        this.isRaycast = isRaycast;
        this.ignorePlayer = ignorePlayer;
        this.enabled = true;
        this.interacting = false;
        this.result = undefined;
        interactions.push(this);
        this.interval = alt.setInterval(() => {
            this.check(this);
        }, 1000);
    }

    clearInterval() {
        alt.clearInterval(this.interval);
    }

    // Used to check what is around us.
    check(ref) {
        // Special Params
        if (ref.isRaycast) {
            let result = getEntityFromRaycast(ref.flag, ref.ignorePlayer);
            if (!result) {
                ref.interacting = false;
                return;
            }
            // If the result is not undefined; spin up interaction.
            ref.interacting = true;
            ref.result = result;
        }
    }

    // This is where the majority of our interactions work.
    render() {
        if (!this.interacting) return;

        // Show Help / Disable Control for Usage
        const msg = 'Hold ~INPUT_CONTEXT~ to Use Interaction Menu';
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(msg);
        native.endTextCommandDisplayHelp(0, false, true, -1);
        native.disableControlAction(0, this.key, true); // Disable 'E' for interaction.

        // Wait for the user to press 'E'.
        if (native.isDisabledControlPressed(0, this.key)) {
            if (!this.areKeysReady) {
                this.areKeysReady = true;
                alt.on('keyup', keyBinds);
                currentInteraction = this;
            }
            // Stop the player from moving for this interaciton.
            native.disableAllControlActions(0);
            this.drawKeyOptions(this);
        }

        // When 'E' is released; turn the keys off.
        if (native.isDisabledControlJustReleased(0, this.key)) {
            this.areKeysReady = false;
            alt.off('keyup', keyBinds);
            currentInteraction = undefined;
        }
    }

    drawKeyOptions(ref) {
        ref.keyBinds.forEach((keybind, index) => {
            // Get the line height.
            const lineHeight = native.getTextScaleHeight(0.5, 4);

            utilityText.drawText2d(
                `${keybind.key}: ${keybind.message}`,
                0.25,
                0.25 + lineHeight * index, // Offset based on index.
                0.5,
                4,
                255,
                255,
                255,
                255,
                true,
                true,
                99
            );
        });
    }
}

alt.setInterval(parseQuickInteracts, 0);

// Loop through interactions.
function parseQuickInteracts() {
    if (interactions.length <= 0) return;

    interactions.forEach(interaction => {
        if (!interaction.enabled) return;
        interaction.render();
    });
}

function keyBinds(key) {
    if (currentInteraction === undefined) return;

    currentInteraction.keyBinds.forEach(keyBind => {
        if (key !== keyBind.key.charCodeAt(0)) return;
        // Call the function if it exists for the key.
        // We also pass the result no matter what it is.
        // Up to the user to figure out what the result is.
        // It's their interaction. :)
        if (keyBind.func === undefined) return;

        // Emit the function.
        keyBind.func(currentInteraction.result);
    });
}

function getEntityFromRaycast(flag, ignorePlayer) {
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
                return alt.Player.all.find(p => p.scriptID === _entity);
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
