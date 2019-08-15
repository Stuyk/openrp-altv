import * as alt from 'alt';
import * as vector from '../utility/vector.mjs';
import { ChatConfig } from '../configuration/chat.mjs';

console.log('Loaded: chat->chat.mjs');

// This chat is relayed from the Chat-Extended resource.
export function relayChat(player, msg) {
    // If they are not currently logged in; don't send the message.
    if (player.characterData === undefined) return;

    // If the character name is not set; we force them to set one.
    if (player.characterData.charactername === null) {
        alt.emitClient(player, 'chooseRoleplayName');
        return;
    }

    // Relaying the information to the people around the player.
    var playersInRange = vector.getPlayersInRange(
        player.pos,
        ChatConfig.maxChatRange
    );

    const sender = player.characterData.charactername;

    for (var i = 0; i < playersInRange.length; i++) {
        playersInRange[i].sendMessage(`${sender}: ${msg}`);
    }
}
