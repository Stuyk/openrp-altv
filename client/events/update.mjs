import * as alt from 'alt';
import * as native from 'natives';
import * as text from 'client/utility/text.mjs';
import * as vector from 'client/utility/vector.mjs';

alt.log('Loaded: events->update.mjs');

alt.on('update', () => {
    drawPlayerNames();
});

function drawPlayerNames() {
    if (alt.Player.all.length <= 0) return;

    let lPos = alt.Player.local.pos;

    alt.Player.all.forEach(player => {
        if (player === alt.Player.local) return;

        let localPlayerName = player.getSyncedMeta('charactername');

        if (localPlayerName === undefined || localPlayerName === null) return;

        // Check if player is on screen.
        if (!native.isEntityOnScreen(player.scriptID)) return;

        const dist = native.getDistanceBetweenCoords(
            lPos.x,
            lPos.y,
            lPos.z,
            player.pos.x,
            player.pos.y,
            player.pos.z,
            true
        );

        // If they are check how far they are.
        if (dist >= 25) return;

        // Check if player has line of sight.
        if (
            !native.hasEntityClearLosToEntity(
                alt.Player.local.scriptID,
                player.scriptID,
                17
            )
        )
            return;

        // Scale the Text
        let scale = (1 / dist) * 2;
        let fov = (1 / native.getGameplayCamFov()) * 100;
        scale = scale * fov;

        // Scale Limiters
        if (scale > 0.8) scale = 0.8;

        if (scale < 0.25) scale = 0.25;

        // Draw Text
        text.drawText3d(
            localPlayerName,
            player.pos.x,
            player.pos.y,
            player.pos.z + 1.45,
            scale,
            4,
            255,
            255,
            255,
            100,
            true,
            false,
            99
        );
    });
}
