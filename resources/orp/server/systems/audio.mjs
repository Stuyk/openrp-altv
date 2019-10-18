import * as alt from 'alt';
import { getPlayersInRange } from '../utility/vector.mjs';

alt.onClient('audio:Sync3D', (player, soundName) => {
    const players = getPlayersInRange(player.pos, 10);
    if (players.length <= 0) return;
    players.forEach(target => {
        if (target === player) return;
        target.playAudio3D(player, soundName);
    });
});
