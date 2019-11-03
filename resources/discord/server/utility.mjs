import * as alt from 'alt';
import { getRemoteIP } from './express.mjs';

export function fetchPlayerByIP(ip) {
    const players = [...alt.Player.all];
    const remoteIP = getRemoteIP();

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player) {
            continue;
        }

        if (player.authenticated) {
            continue;
        }

        const userID = player.getMeta('id');
        if (userID) {
            continue;
        }

        if (player.ip === ip) {
            return player;
        }

        if (ip.includes('127.0.0.1')) {
            if (player.ip.includes(remoteIP)) {
                return player;
            }
        }
    }

    return undefined;
}
