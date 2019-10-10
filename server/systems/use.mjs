import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import * as chat from '../chat/chat.mjs';
import { actionMessage } from '../chat/chat.mjs';

export function sodaMachine(player) {
    if (!player.subCash(5)) {
        player.send(`You don't have enough money for a soda. {FFFF00}$5.00`);
        return;
    }

    let itemTemplate = configurationItems.Items.soda;
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

export function atm(player) {
    player.showAtmPanel();
}

export function exitLabs(player) {
    player.pos = { x: 3626.514404296875, y: 3752.325439453125, z: 28.515737533569336 };
}

export function cuffPlayer(arrester, arrestee) {
    if (!arrester || !arrestee) return;
    arrester.cuffedPlayer = arrestee;
    arrestee.isArrested = true;
    alt.emitClient(arrestee, 'arrest:Tazed', -1);
    arrestee.setSyncedMeta('arrested', arrester);
    arrestee.emitMeta('arrest', arrester);
    actionMessage(
        arrester,
        `Forces ${arrestee.data.name.replace(
            '_',
            ' '
        )}'s hands behind their back and cuffs them.`
    );
}

export function uncuffPlayer(arrester, arrestee) {
    if (!arrester || !arrestee) return;
    arrester.cuffedPlayer = null;
    arrestee.isArrested = false;
    arrestee.setSyncedMeta('arrested', undefined);
    arrestee.emitMeta('arrest', undefined);
    actionMessage(
        arrester,
        `Uses their keys to uncuff ${arrestee.data.name.replace('_', ' ')}.`
    );
}
