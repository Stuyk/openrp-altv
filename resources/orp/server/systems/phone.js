import * as alt from 'alt';

export function addContact(player, id) {
    if (!player.hasItem('phone')) {
        player.notify(`You don't seem to have a phone.`);
        return;
    }

    if (isNaN(id)) {
        player.notify(`That number is not a phone number.`);
        player.syncContacts();
        return;
    }

    if (player.data.id === parseInt(id)) {
        player.notify(`You cannot add yourself.`);
        player.syncContacts();
        return;
    }

    if (player.hasContact(parseInt(id))) {
        player.notify(`${id} is already in your list.`);
        player.syncContacts();
        return;
    }

    if (!player.addContact(parseInt(id))) {
        player.notify(`That number is already in your phone.`);
        player.syncContacts();
        return;
    }

    player.notify(`${id} was added into your phone.`);
    player.syncContacts();
}

export function deleteContact(player, id) {
    if (!player.hasItem('phone')) {
        player.notify(`You don't seem to have a phone.`);
        return;
    }

    if (player.data.id === id) {
        player.notify(`You cannot remove yourself.`);
        player.syncContacts();
        return;
    }

    if (isNaN(id)) {
        player.notify(`That number is not a phone number.`);
        player.syncContacts();
        return;
    }

    if (!player.hasContact(parseInt(id))) {
        player.notify(`${id} is not someone you know.`);
        player.syncContacts();
        return;
    }

    if (!player.removeContact(parseInt(id))) {
        player.notify(`That number is not in your phone.`);
        player.syncContacts();
        return;
    }

    player.notify(`${id} was removed from your phone.`);
    player.syncContacts();
}
