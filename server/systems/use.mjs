import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import * as chat from '../chat/chat.mjs';
import { actionMessage } from '../chat/chat.mjs';
import { appendToMdc } from './mdc.mjs';

export let doorStates = {
    '{"x":461.8065185546875,"y":-994.4085693359375,"z":25.06442642211914}': {
        pos: {
            x: 461.8065185546875,
            y: -994.4085693359375,
            z: 25.06442642211914
        },
        type: 631614199,
        heading: 0,
        locked: true
    },
    '{"x":461.8064880371094,"y":-997.6583251953125,"z":25.06442642211914}': {
        pos: {
            x: 461.8064880371094,
            y: -997.6583251953125,
            z: 25.06442642211914
        },
        type: 631614199,
        heading: 0,
        locked: true
    },
    '{"x":461.8065185546875,"y":-1001.301513671875,"z":25.06442642211914}': {
        pos: {
            x: 461.8065185546875,
            y: -1001.301513671875,
            z: 25.06442642211914
        },
        type: 631614199,
        heading: 0,
        locked: true
    }
};

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

export function cuffPlayerFreely(arrester, arrestee) {
    if (!arrester || !arrestee) return;
    if (arrester.cuffedPlayer) {
        arrester.send('You already have a player cuffed.');
        return;
    }

    const cuffCount = arrester.hasQuantityOfItem('cuffs', 1);
    const ropeCount = arrester.hasQuantityOfItem('rope', 1);

    if (!cuffCount && !ropeCount) {
        arrester.send('You cannot bind this player without rope or cuffs.');
        return;
    }

    if (cuffCount) {
        arrestee.cuffTime = Date.now() + 60000 * 10;
        arrester.send('You use your cuffs.');
    } else {
        arrestee.cuffTime = Date.now() + 60000 * 5;
        arrester.subItem('rope', 1);
        arrester.send('You use a bundle of rope.');
    }

    arrester.cuffedPlayer = arrestee;
    arrestee.isArrested = true;
    arrestee.unequipItem(11);
    alt.emitClient(arrestee, 'arrest:Tazed', -1);
    arrestee.setSyncedMeta('arrested', arrester);
    arrestee.setSyncedMeta('arrestedFreely', true);
    arrestee.emitMeta('arrest', arrester);
    actionMessage(
        arrester,
        `Forces ${arrestee.data.name.replace(
            '_',
            ' '
        )}'s hands behind their back and binds them.`
    );
}

export function friskPlayer(arrester, arrestee) {
    const results = arrester.searchItems();

    if (!results.hasDrugs && !results.hasWeapons) {
        const msg = `Frisks ${arrestee.data.name.replace('_', ' ')} and finds nothing.`;
        actionMessage(arrester, msg);
    }

    if (results.hasDrugs) {
        const msg = `Frisks ${arrestee.data.name.replace('_', ' ')} and finds drugs.`;
        actionMessage(arrester, msg);
        appendToMdc('None - Frisked', arrestee.data.name, 'Drugs');
    }

    if (results.hasWeapons) {
        const msg = `Frisks ${arrestee.data.name.replace('_', ' ')} and finds weapons.`;
        actionMessage(arrester, msg);
        appendToMdc('None - Frisked', arrestee.data.name, 'Weapons');
    }

    cuffPlayer(arrester, arrestee);
}

export function cuffPlayer(arrester, arrestee) {
    if (!arrester || !arrestee) return;
    if (arrester.cuffedPlayer) {
        arrester.send('You already have a player cuffed.');
        return;
    }

    const cuffCount = arrester.hasQuantityOfItem('cuffs', 1);
    const ropeCount = arrester.hasQuantityOfItem('rope', 1);

    if (!cuffCount && !ropeCount) {
        arrester.send('You cannot bind this player without rope or cuffs.');
        return;
    }

    if (cuffCount) {
        arrestee.cuffTime = Date.now() + 60000 * 10;
        arrester.send('You use your cuffs.');
    } else {
        arrestee.cuffTime = Date.now() + 60000 * 5;
        arrester.subItem('rope', 1);
        arrester.send('You use a bundle of rope.');
    }

    arrester.cuffedPlayer = arrestee;
    arrestee.isArrested = true;
    arrestee.unequipItem(11);
    alt.emitClient(arrestee, 'arrest:Tazed', -1);
    arrestee.setSyncedMeta('arrested', arrester);
    arrestee.setSyncedMeta('arrestedFreely', false);
    arrestee.emitMeta('arrest', arrester);
    actionMessage(
        arrester,
        `Forces ${arrestee.data.name.replace(
            '_',
            ' '
        )}'s hands behind their back and binds them.`
    );
}

export function uncuffPlayer(arrester, arrestee) {
    if (!arrester || !arrestee) return;
    arrester.cuffedPlayer = null;
    arrestee.isArrested = false;
    arrestee.cuffTime = 0;
    arrestee.setSyncedMeta('arrested', undefined);
    arrestee.emitMeta('arrest', undefined);
    actionMessage(
        arrester,
        `Uses their keys to uncuff ${arrestee.data.name.replace('_', ' ')}.`
    );
}

export function breakCuffs(player) {
    if (!player.cuffTime) return;
    if (Date.now() > player.cuffTime) {
        player.setSyncedMeta('arrested', undefined);
        player.emitMeta('arrest', undefined);
        actionMessage(player, `Breaks free from their binding.`);
    } else {
        const timeRemaining = Math.abs((Date.now() - player.cuffTime) / 1000);
        player.send(`Cuffs are breakable in ${timeRemaining} seconds.`);
        actionMessage(player, `Tries fiddling with their bindings.`);
    }
}

export function toggleDoor(player, data) {
    if (data.type === 631614199) {
        if (!player.job) return;
        if (!player.job.name.includes('Officer')) return;
    }

    if (data.locked) {
        data.locked = false;
        doorStates[`${JSON.stringify(data.pos)}`] = data;
        alt.emitClient(null, 'door:Unlock', data.type, data.pos, data.heading);
    } else {
        data.locked = true;
        doorStates[`${JSON.stringify(data.pos)}`] = data;
        alt.emitClient(null, 'door:Lock', data.type, data.pos, data.heading);
    }
}
