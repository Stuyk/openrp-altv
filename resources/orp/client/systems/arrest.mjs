import * as alt from 'alt';
import * as native from 'natives';
import { loadAnim } from '/client/systems/animation.mjs';
import { distance } from '/client/utility/vector.mjs';

let arrester;
let interval;
let arrestPos;
let lastCuffCheck = Date.now();

// When the player updates their inventory.
alt.on('meta:Changed', (key, value) => {
    if (key === 'arrest') {
        arrester = value;

        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }

        // Setup Arrest State
        if (value) {
            const res = loadAnim('mp_arresting');
            res.then(() => {
                native.taskPlayAnim(
                    alt.Player.local.scriptID,
                    'mp_arresting',
                    'idle',
                    8.0,
                    -8,
                    -1,
                    49,
                    0,
                    false,
                    false,
                    false
                );
            });
            interval = alt.setInterval(arrestHandler, 50);
            alt.emit('view:ForceClose');
        } else {
            native.clearPedTasks(alt.Player.local.scriptID);
        }
    }
});

function arrestHandler() {
    if (!arrester) return;

    const inAnim = native.isEntityPlayingAnim(
        alt.Player.local.scriptID,
        'mp_arresting',
        'idle',
        0
    );

    if (!inAnim && Date.now() > lastCuffCheck) {
        lastCuffCheck = Date.now() + 10000;
        native.clearPedTasks(alt.Player.local.scriptID);
        native.taskPlayAnim(
            alt.Player.local.scriptID,
            'mp_arresting',
            'idle',
            8.0,
            -8,
            -1,
            49,
            0,
            false,
            false,
            false
        );
    }

    if (native.isPedInAnyVehicle(arrester.scriptID, false)) {
        if (!arrester.vehicle) return;
        const veh = arrester.vehicle.scriptID;

        if (alt.Player.local.vehicle) {
            if (alt.Player.local.vehicle.scriptID === veh) return;
        }

        if (native.areAnyVehicleSeatsFree(veh)) {
            for (let i = 1; i < 4; i++) {
                if (native.isVehicleSeatFree(veh, i, false)) {
                    native.taskWarpPedIntoVehicle(alt.Player.local.scriptID, veh, i);
                    break;
                }
            }
        }
        return;
    } else {
        if (alt.Player.local.vehicle) {
            native.taskLeaveVehicle(
                alt.Player.local.scriptID,
                alt.Player.local.vehicle.scriptID,
                256
            );
        }
    }

    if (alt.Player.local.getSyncedMeta('arrestedFreely')) return;
    const dist = distance(arrester.pos, alt.Player.local.pos);
    if (dist < 2) return;

    const fwd = native.getEntityForwardVector(arrester.scriptID);
    const lastPos = {
        x: arrester.pos.x - fwd.x * 0.75,
        y: arrester.pos.y - fwd.y * 0.75,
        z: arrester.pos.z
    };

    const heading = native.getEntityHeading(arrester.scriptID);

    native.taskGoStraightToCoord(
        alt.Player.local.scriptID,
        lastPos.x,
        lastPos.y,
        lastPos.z,
        6.0,
        -1,
        heading,
        0
    );
}

alt.onServer('arrest:Tazed', time => {
    if (time <= -1) {
        const clearTask = alt.Player.local.getMeta('arrest:TazerInterval');
        if (clearTask) {
            alt.Player.local.setMeta('arrest:TazerInterval', null);
            native.clearPedTasks(alt.Player.local.scriptID);
        }
        return;
    }

    loadAnim('combat@damage@rb_writhe').then(() => {
        native.taskPlayAnim(
            alt.Player.local.scriptID,
            'combat@damage@rb_writhe',
            'rb_writhe_loop',
            1,
            -1,
            -1,
            1,
            1.0,
            false,
            false,
            false
        );
        alt.Player.local.setMeta('arrest:TazerInterval', true);
        alt.setTimeout(() => {
            const clearTask = alt.Player.local.getMeta('arrest:TazerInterval');

            if (clearTask) {
                native.clearPedTasks(alt.Player.local.scriptID);
            }
        }, time);
    });
});
