import * as alt from 'alt';
import { getPlayersInRange } from '../utility/vector.js';

alt.onClient('particle:Sync', (player, dict, name, duration, scale, x, y, z) => {
    const players = getPlayersInRange(player.pos, 10);
    if (players.length <= 0) return;
    players.forEach(target => {
        if (target === player) return;
        alt.emitClient(
            target,
            'tryParticle',
            dict,
            name,
            duration,
            scale,
            x,
            y,
            z,
            player
        );
    });
});
