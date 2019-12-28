import * as alt from 'alt';
import * as chat from '../chat/chat.js';
import * as vector from '../utility/vector.js';
import { Config } from '../configuration/config.js';

chat.registerCmd('me', (player, args) => {
    if (args.length <= 0) {
        player.send(`{FF0000}/me (does_an_action)`);
        return;
    }

    if (player.data.name === null) {
        player.showRoleplayNameDialogue();
        return;
    }

    let msg = args.join(' ');
    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxMeRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{c5a5de}${player.data.name.replace('_', ' ')} ${msg}`);
        alt.emitClient(target, 'text:playerAction', player, msg);
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

    let msg = args.join(' ');
    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxDoRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ${msg}`);
        alt.emitClient(target, 'text:playerAction', player, msg);
    });
});

chat.registerCmd('cc', (player, args) => {
    if (args.length <= 0) {
        player.send(`{FF0000}/cc (talk_in_car)`);
        return;
    }

    if (!player.vehicle) return;

    let inRange = vector.getPlayersInRange(player.pos, 10, player.dimension);

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

    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxOocRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{878787}${player.data.name} says: (( ${args.join(' ')} ))`);
    });
});

chat.registerCmd('flipcoin', player => {
    const headsOrTails = Math.floor(Math.random() * 2) ? 'heads' : 'tails';
    const msg = `Flips a coin and it lands on ${headsOrTails}`;
    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxOocRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ` + msg);
        alt.emitClient(target, 'text:playerAction', player, `{c5a5de} ${msg}`);
    });
});

chat.registerCmd('sf', player => {
    const sOrF = Math.floor(Math.random() * 2) ? 'succeed' : 'fail';
    const msg = `${sOrF}`;
    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxOocRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ` + msg);
        alt.emitClient(target, 'text:playerAction', player, `{c5a5de} ${msg}`);
    });
});

chat.registerCmd('d20', player => {
    const diceCount = player.hasQuantityOfItem('dice', 1);

    if (!diceCount) {
        player.send('You cannot roll without a dice.');
        return;
    }

    const d20 = Math.floor(Math.random() * 20) + 1;
    const msg = `Rolls a dice and it lands on ${d20}`;
    let inRange = vector.getPlayersInRange(
        player.pos,
        Config.maxOocRange,
        player.dimension
    );

    inRange.forEach(target => {
        target.send(`{c5a5de}* (( ${player.data.name.replace('_', ' ')} )) ` + msg);
        alt.emitClient(target, 'text:playerAction', player, `{c5a5de} ${msg}`);
    });
});
