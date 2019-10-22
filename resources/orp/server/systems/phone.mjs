import * as alt from 'alt';

export function addContact(player, id) {
    if (!player.hasItem('phone')) {
        player.notify(`You don't seem to have a phone.`);
        return;
    }

    if (isNaN(id)) {
        player.notify(`That number is not a phone number.`);
        return;
    }

    if (player.data.id === parseInt(id)) {
        player.notify(`You cannot add yourself.`);
        return;
    }

    if (!player.addContact(parseInt(id))) {
        player.notify(`That number is already in your phone.`);
        return;
    }

    player.notify(`${id} was added into your phone.`);
}
