import * as alt from 'alt';
import * as native from 'natives';
import * as text from 'client/utility/text.mjs';
import { distance } from '/client/utility/vector.mjs';

alt.log('Loaded: events->update.mjs');
alt.on('meta:Changed', loadInterval);

const [_, width, height] = native.getActiveScreenResolution(0, 0);

// Only starts the interval after the player has logged in.
function loadInterval(key) {
    if (key !== 'loggedin') return;
    alt.off('meta:Changed', loadInterval);

    const intervalID = alt.setInterval(drawPlayerNames, 0);
    alt.log(`update.mjs ${intervalID}`);
}

function drawPlayerNames() {
    native.hideHudComponentThisFrame(6);
    native.hideHudComponentThisFrame(7);
    native.hideHudComponentThisFrame(8);
    native.hideHudComponentThisFrame(9);

    if (alt.Player.local.getSyncedMeta('dead')) {
        native.setPedToRagdoll(alt.Player.local.scriptID, -1, -1, 0, 0, 0, 0);
    }

    alt.emit('hud:ClearNametags');
    if (alt.Player.all.length <= 1) return;

    const currentPlayers = [...alt.Player.all];
    let count = 0;
    currentPlayers.forEach(target => {
        if (count >= 30) return;
        const renderData = getPlayerOnScreen(target);
        if (!renderData) return;
        count += 1;

        const isChatting = target.getMeta('isChatting');
        const color = target.getSyncedMeta('namecolor');
        let name = color
            ? color + renderData.name.replace('_', ' ')
            : renderData.name.replace('_', ' ');
        name = isChatting ? `${name}~n~~o~. . .` : name;

        let scale = 0.5 - renderData.dist * 0.01;
        text.drawText3d(
            name,
            renderData.pos.x,
            renderData.pos.y,
            renderData.pos.z + 1.45,
            scale,
            4,
            255,
            255,
            255,
            200,
            true,
            false,
            99
        );
    });
}

function getPlayerOnScreen(target) {
    if (target === alt.Player.local) return undefined;

    const localPlayerName = target.getSyncedMeta('name');
    if (!localPlayerName) return undefined;

    const onScreen = native.isEntityOnScreen(target.scriptID);
    if (!onScreen) return undefined;

    const dist = distance(alt.Player.local.pos, target.pos);
    if (dist > 25) return undefined;

    const id = alt.Player.local.scriptID;
    const los = native.hasEntityClearLosToEntity(id, target.scriptID, 17);
    if (!los) return undefined;

    return { name: localPlayerName, dist, pos: target.pos };
}
