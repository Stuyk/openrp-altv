import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';

chat.registerCmd('stuck', (player, value) => {
    if (!player.lastStuckTime) {
        player.lastStuckTime = Date.now() + 20000;
    } else {
        if (player.lastStuckTime > Date.now()) return;
    }

    player.send('You were slapped.');
    player.playAudio('slap');
    player.pos = {
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z + 1
    };
});

chat.registerCmd('unstuck', (player, value) => {
    if (!player.lastStuckTime) {
        player.lastStuckTime = Date.now() + 20000;
    } else {
        if (player.lastStuckTime > Date.now()) return;
    }

    player.send('You were slapped.');
    player.playAudio('slap');
    player.pos = {
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z + 1
    };
});

chat.registerCmd('playtime', player => {
    player.send(
        `Total Time Played (Estimated): ${player.getTotalPlayTime().toFixed(2)} Hours`
    );
});
