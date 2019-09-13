import * as alt from 'alt';
import * as vector from '../utility/vector.mjs';
import { ChatConfig } from '../configuration/chat.mjs';

console.log('Loaded: chat->chat.mjs');

let cmds = {};
let mutedPlayers = [];

export function registerCmd(cmd, callback, adminlevel = "user") {
    if (cmds[cmd] !== undefined) {
        alt.logError(`Failed to register command /${cmd}, already registered`);
    } else {
        cmds[cmd] = {
            callback,
            adminlevel
        };
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

            const command = cmds[cmd];

            if (command != null) {
                if (command.adminlevel == 'user' || player.admingroup === 'superadmin') {
                    command.callback(player, args);
                } else {
                    if (command.adminlevel == player.admingroup) {
                        command.callback(player, args);
                    } else {
                        const indexOfRequired = ChatConfig.adminGroups.indexOf(command.adminlevel);
                        const indexOfPlayer = ChatConfig.adminGroups.indexOf(player.admingroup);
                        if (indexOfRequired <= indexOfPlayer) {
                            command.callback(player, args);
                        } else {
                            player.send(player, `You haven't the autorization of doing /${cmd}`);
                        }
                    }
                }
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
        player.showRoleplayNameDialogue();
        return;
    }

    var playersInRange = vector.getPlayersInRange(player.pos, ChatConfig.maxChatRange);
    const sender = player.data.name.replace('_', ' ');
    const message = `${sender} says: ${msg}`;
    alt.log(message);

    for (var i = 0; i < playersInRange.length; i++) {
        playersInRange[i].send(message);
    }
}

export function actionMessage(player, msg) {
    if (player.data.name === null) {
        alt.emitClient(player, 'chooseRoleplayName');
        return;
    }

    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxDoRange);
    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ${msg}`);
    });
}
