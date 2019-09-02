import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import * as chat from '../chat/chat.mjs';

export function sodaMachine(player) {
    if (!player.subCash(5)) {
        player.send(`You don't have enough money for a soda. {FFFF00}$5.00`);
        return;
    }

    let itemTemplate = configurationItems.Items['Soda'];
    let clonedTemplate = { ...itemTemplate }; // Clone the template.

    player.addItem(clonedTemplate, 1);
    chat.actionMessage(
        player,
        'Inserts money into the machine; and it spits out a soda.'
    );
}

export function payPhone(player) {
    player.send('The tone is silent.');
}

export function metroTicketMachine(player) {
    player.send('The machine spits out some tickets.');
}

export function postalBox(player) {
    player.send('You have no mail to send today.');
}

export function hideDumpster(player) {
    player.send(`The dumpster won't open.`);
}

export function leaveDumpster(player) {
    player.send(`You leave the dumpster.`);
}

export function searchDumpster(player) {
    player.send('You find nobody inside.');
}
