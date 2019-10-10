import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as vector from '../utility/vector.mjs';
import { ChatConfig } from '../configuration/chat.mjs';

chat.registerCmd('me', (player, args) => {
    if (args.length <= 0) {
        player.send(`{FF0000}/me (does_an_action)`);
        return;
    }

    if (player.data.name === null) {
        player.showRoleplayNameDialogue();
        return;
    }

    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxMeRange);

    inRange.forEach(target => {
        target.send(`{c5a5de}${player.data.name.replace('_', ' ')} ${args.join(' ')}`);
    });
});

chat.registerCmd('do', (player, args) => {
    if (args.length <= 0) {
        player.send(`{FF0000}/do (describes_an_action)`);
        return;
    }

    if (player.data.name === null) {
        alt.emitClient(player, 'chooseRoleplayName');
        return;
    }

    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxDoRange);
    inRange.forEach(target => {
        target.send(
            `{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ${args.join(' ')}`
        );
    });
});

chat.registerCmd('cc', (player, args) => {
    if (args.length <= 0) {
        player.send(`{FF0000}/cc (talk_in_car)`);
        return;
    }

    if (!player.vehicle) return;

    let inRange = vector.getPlayersInRange(player.pos, 10);

    inRange.forEach(target => {
        if (target.vehicle !== player.vehicle) return;

        target.send(`{bfc0c2}${player.data.name}: ${args.join(' ')}`);
    });
});

chat.registerCmd('b', (player, args) => {
    if (args.length <= 0) {
        player.send(`{FF0000}/b (talk_out_of_character)`);
        return;
    }

    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxOocRange);
    inRange.forEach(target => {
        target.send(`{878787}${player.data.name} says: (( ${args.join(' ')} ))`);
    });
});

chat.registerCmd('flipcoin', player => {
    const headsOrTails = Math.floor(Math.random() * 2) ? 'heads' : 'tails';
    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxOocRange);
    inRange.forEach(target => {
        target.send(
            `{c5a5de}* (( ${player.data.name.replace(
                '_',
                ' '
            )} )) Flips a coin and it lands on ${headsOrTails}`
        );
    });
});

chat.registerCmd('sf', player => {
    const sOrF = Math.floor(Math.random() * 2) ? 'succeed' : 'fail';
    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxOocRange);
    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ${sOrF}`);
    });
});

chat.registerCmd('d20', player => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    let inRange = vector.getPlayersInRange(player.pos, ChatConfig.maxOocRange);
    inRange.forEach(target => {
        target.send(
            `{c5a5de}* (( ${player.data.name.replace(
                '_',
                ' '
            )} )) Rolls a dice and it lands on ${d20}`
        );
    });
});
