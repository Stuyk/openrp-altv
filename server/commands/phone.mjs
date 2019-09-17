import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';

chat.registerCmd('t', (player, args) => {
    if (args === undefined || args.length <= 1) {
        player.send('Usage: /t (id) (message)');
        return;
    }

    if (!player.hasItem('Phone')) {
        player.send(`You don't seem to have a phone.`);
        return;
    }

    let number = args.shift();
    if (isNaN(number)) {
        player.send(`${number} is not a number.`);
        return;
    }

    number = parseInt(number);
    if (player.data.id === number) {
        player.send(`{FF0000} You cannot text yourself.`);
        return;
    }

    if (!player.hasContact(number)) {
        player.send(`${number} is not someone you know.`);
        return;
    }

    const msg = args.join(' ');
    let users = alt.Player.all.filter(x => x.data !== undefined && x.data.id === number);
    let user = users[0];
    if (!user) {
        player.send(`{FFFF00} That number is not in service at this time.`);
        return;
    }

    if (!user.hasContact(player.data.id)) {
        player.send(`${number} is not someone you know.`);
        return;
    }

    if (!user.hasItem('Phone')) {
        player.send(`{FFFF00} That number is not in service at this time.`);
        return;
    }

    user.send(`{FFFF00}SMS: ${msg} | Sender: ${user.data.name} (${player.data.id})`);
    player.send(`{d4d400}SENT: ${msg} | To: ${user.data.name} (${number})`);
});

chat.registerCmd('addcontact', (player, arg) => {
    if (arg === undefined || arg.length <= 0) {
        player.send(`{FF0000} Usage: /addcontact (number)`);
        return;
    }

    if (!player.hasItem('Phone')) {
        player.send(`You don't seem to have a phone.`);
        return;
    }

    if (isNaN(arg[0])) {
        player.send(`{FF0000} That number is not a phone number.`);
        return;
    }

    if (player.data.id === parseInt(arg[0])) {
        player.send(`{FF0000} You cannot add yourself.`);
        return;
    }

    if (!player.addContact(parseInt(arg[0]))) {
        player.send(`{FF0000} That number is already in your phone.`);
        return;
    }

    player.send(`{00FF00}${arg[0]} {FFFFFF} was added into your phone.`);
});

chat.registerCmd('removecontact', removeContact);
chat.registerCmd('deletecontact', removeContact);

function removeContact(player, arg) {
    if (arg === undefined || arg.length <= 0) {
        player.send(`{FF0000} Usage: /removecontact (number)`);
        return;
    }

    if (!player.hasItem('Phone')) {
        player.send(`You don't seem to have a phone.`);
        return;
    }

    if (player.data.id === parseInt(arg[0])) {
        player.send(`{FF0000} You cannot remove yourself.`);
        return;
    }

    if (isNaN(arg[0])) {
        player.send(`{FF0000} That number is not a phone number.`);
        return;
    }

    if (!player.hasContact(parseInt(arg[0]))) {
        player.send(`${arg[0]} is not someone you know.`);
        return;
    }

    if (!player.removeContact(parseInt(arg[0]))) {
        player.send(`{FF0000} That number is not in your phone.`);
        return;
    }

    player.send(`{00FF00}${arg[0]} {FFFFFF} was removed from your phone.`);
}

chat.registerCmd('call', (player, arg) => {
    if (arg === undefined || arg.length <= 0) {
        player.send(`{FF0000} Usage: /call (number)`);
        return;
    }

    if (!player.hasItem('Phone')) {
        player.send(`You don't seem to have a phone.`);
        return;
    }

    let number = arg[0];
    if (isNaN(number)) {
        player.send(`${number} is not a number.`);
        return;
    }

    number = parseInt(number);
    if (player.data.id === number) {
        player.send(`{FF0000} You cannot call yourself.`);
        return;
    }

    if (!player.hasContact(number)) {
        player.send(`${number} is not someone you know.`);
        return;
    }

    let users = alt.Player.all.filter(x => x.data !== undefined && x.data.id === number);
    let user = users[0];
    if (!user) {
        player.send(`{FFFF00} That number is not in service at this time.`);
        return;
    }

    if (!user.hasItem('Phone')) {
        player.send(`{FFFF00} That number is not in service at this time.`);
        return;
    }

    if (user.call) {
        player.send(`{FFFF00} That number is busy at this time.`);
        return;
    }

    const endTime = Date.now() + 9000;
    const interval = setInterval(() => {
        if (!user) {
            clearInterval(interval);
            return;
        }

        if (!player) {
            clearInterval(interval);
            return;
        }

        if (Date.now() > endTime) {
            clearInterval(interval);
            if (user) {
                user.call = undefined;
            }

            if (player) {
                player.call = undefined;
            }
            return;
        }

        user.send(
            `{FFFF00} (${player.data.id}) Your phone is ringing... | Use: /answer to pickup.`
        );
        player.send(`{FFFF00} The phone rings...`);
    }, 3000);

    player.call = {
        pickedup: false,
        calling: user,
        interval
    };
    player.send(`{FFFF00} The phone begins to ring...`);
    user.call = {
        pickedup: false,
        calling: player
    };
});

chat.registerCmd('answer', player => {
    if (player.call === undefined) {
        player.send('{FF0000} Nobody is calling you at this time.');
        return;
    }

    if (!player.hasItem('Phone')) {
        player.send(`You don't seem to have a phone.`);
        return;
    }

    if (player.call.pickedup) return;
    if (player.call.interval) {
        player.send('{FF0000} You cannot answer the phone for them.');
        return;
    }

    let target = player.call.calling;

    clearInterval(player.call.calling.call.interval);
    player.call.pickedup = true;
    target.call.pickedup = true;
    target.send(`{FFFF00} You hear them pickup.`);
    player.send(`{FFFF00} You answer the phone.`);
});

chat.registerCmd('hangup', player => {
    if (!player.call) {
        player.send('{FF0000} You are not in a call');
        return;
    }

    let target = player.call.calling;

    if (player.call.interval) {
        clearInterval(player.call.interval);
    } else {
        clearInterval(target.call.interval);
    }

    if (target) {
        target.send('{FFFF00} The call has ended.');
        delete target.call;
    }

    if (player) {
        player.send('{FFFF00} The call has ended.');
        delete player.call;
    }
});
