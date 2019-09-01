import * as alt from 'alt';

export function sodaMachine(player) {
    player.send('You press a button on the machine. It does nothing.');
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
