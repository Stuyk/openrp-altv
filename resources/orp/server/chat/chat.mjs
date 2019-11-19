import * as alt from 'alt';
import * as vector from '../utility/vector.mjs';
import { Config } from '../configuration/config.mjs';
import { hasPermission, AdminFlags } from '../systems/admin.mjs';

let cmds = {};
let mutedPlayers = [];

export function registerCmd(cmd, callback) {
    registerRankedCmd(cmd, 0, callback);
}

export function registerRankedCmd(cmd, rank, callback) {
    if (cmds[cmd] !== undefined) {
        alt.logError(`Failed to register command /${cmd}, already registered`);
    } else {
        cmds[cmd] = {
            callback,
            rank
        };
    }
}

alt.on('orp:RegisterCmd', (cmd, eventNameCallback) => {
    registerCmd(cmd, eventNameCallback);
    alt.log(`Registered Addon CMD: ${cmd}`);
});

export function routeMessage(player, msg) {
    // Commands
    if (msg[0] === '/') {
        msg = msg.trim().slice(1);

        if (msg.length > 0) {
            alt.log('[CMD] ' + player.name + ': /' + msg);

            let args = msg.split(' ');
            let cmd = args.shift().toLowerCase();

            if (!cmds[cmd]) {
                player.send('Not a valid command.');
                return;
            }

            const callback = cmds[cmd].callback;

            if (cmds[cmd].rank !== 0) {
                if (!hasPermission(player, cmds[cmd].rank)) {
                    player.send('You do not have permission for this command.');
                    return;
                }
            }

            if (callback) {
                if (typeof callback === 'function') {
                    callback(player, args);
                } else {
                    alt.emit(callback, player, args);
                }
            } else {
                player.send(`Unknown command /${cmd}`);
            }
        }
        return;
    }

    // Regular chat messages.
    if (mutedPlayers.includes(player.name)) {
        player.send('You are muted at this time.');
        return;
    }

    msg = msg.trim();
    if (msg.length <= 0) return;

    handleMessage(player, msg);
}

function handleMessage(player, msg) {
    if (player.data === undefined) return;

    if (player.data.name === null) {
        player.showRoleplayNameDialogue();
        return;
    }

    var playersInRange = vector.getPlayersInRange(
        player.pos,
        Config.maxChatRange,
        player.dimension
    );

    const sender = player.data.name.replace('_', ' ');
    const message = `${sender} says: ${msg}`;
    alt.log(message);

    if (player.call) {
        if (player.call.calling && player.call.pickedup) {
            player.call.calling.send(`{FFFF00}${sender} says: ${msg}`);
        }
    }

    for (var i = 0; i < playersInRange.length; i++) {
        playersInRange[i].send(message);
    }
}

export function actionMessage(player, msg) {
    if (player.data.name === null) {
        alt.emitClient(player, 'chooseRoleplayName');
        return;
    }

    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxDoRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ${msg}`);
    });
}

export function setStatus(player, value) {
    alt.emitClient(null, 'chat:SetStatus', player, value);
}
