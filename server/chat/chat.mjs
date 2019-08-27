import * as alt from 'alt';
import * as vector from '../utility/vector.mjs';
import { ChatConfig } from '../configuration/chat.mjs';

console.log('Loaded: chat->chat.mjs');

let cmds = {};
let mutedPlayers = [];

export function registerCmd(cmd, callback) {
    if (cmds[cmd] !== undefined) {
        alt.logError(`Failed to register command /${cmd}, already registered`);
    } else {
        cmds[cmd] = callback;
    }
}

export function routeMessage(player, msg) {
    // Commands
    if (msg[0] === '/') {
        msg = msg.trim().slice(1);

        if (msg.length > 0) {
            alt.log('[CMD] ' + player.name + ': /' + msg);

            let args = msg.split(' ');
            let cmd = args.shift();

            const callback = cmds[cmd];

            if (callback) {
                callback(player, args);
            } else {
                player.send(player, `Unknown command /${cmd}`);
            }
        }
        return;
    }

    // Regular chat messages.
    if (mutedPlayers.includes(player.name)) {
        player.send(player, `You are muted at this time.`);
        return;
    }

    msg = msg.trim();
    if (msg.length <= 0) return;

    handleMessage(player, msg);
}

function handleMessage(player, msg) {
    if (player.data === undefined) return;

    if (player.data.name === null) {
        alt.emitClient(player, 'chooseRoleplayName');
        return;
    }

    var playersInRange = vector.getPlayersInRange(player.pos, ChatConfig.maxChatRange);
    const sender = player.data.name;

    for (var i = 0; i < playersInRange.length; i++) {
        playersInRange[i].send(`${sender}: ${msg}`);
    }
}
