import * as alt from 'alt';
import { ChatConfig } from '../configuration/chat.mjs';
import * as cache from '../cache/cache.mjs';

alt.on('consoleCommand', (command, argA, argB) => {
    if (command === 'kick') {
        const players = alt.getPlayersByName(argA);
        if (players.length === 1) {
            alt.log(`Kicking ${argA} - Roleplay Name ${players[0].username}`);
            players[0].kick();
        }
    } else if (command === 'setgroup') {
        if (argB == null) return;
        const players = alt.getPlayersByName(argA);
        if (players.length === 1) {
            if (ChatConfig.adminGroups.indexOf(argB) != -1) {
                players[0].admingroup = argB;
                let account = cache.getAccount(players[0].username);
                if (account != null)
                    account.admingroup = argB;
                alt.log(`${players[0].username} - ${argA} Setted to group ${argB}`);
            } else {
                alt.log('That group doesn\'t exist');
            }
        }
    }
});
