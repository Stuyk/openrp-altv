import * as alt from 'alt';
import { Items } from '../configuration/items.mjs';
import * as chat from '../chat/chat.mjs';
import { actionMessage } from '../chat/chat.mjs';
import { appendToMdc } from './mdc.mjs';
import { addBoundWeapon } from './inventory.mjs';
import { getLevel } from './xp.mjs';

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
    if (!Items.soda) return;

    if (!player.subCash(5)) {
        player.send(`You don't have enough money for a soda. {FFFF00}$5.00`);
        return;
    }

    player.addItem('soda', 1, Items.soda.props);
    chat.actionMessage(
        player,
        'Inserts money into the machine; and it spits out a soda.'
    );
}

export function coffeeMachine(player) {
    if (!Items.soda) return;
    if (!player.subCash(5)) {
        player.send(`You don't have enough money for some coffee. {FFFF00}$5.00`);
        return;
    }

    player.addItem('coffee', 1, Items.coffee.props);
    chat.actionMessage(
        player,
        'Inserts money into the machine; and it spits out a canned coffee.'
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

export function hospitalBed(player, coords) {
    coords = {
        x: coords.x,
        y: coords.y,
        z: coords.z + 0.5
    };

    player.pos = coords;
}

export function exitLabs(player) {
    player.pos = { x: 3626.514404296875, y: 3752.325439453125, z: 28.515737533569336 };
}

export function cuffPlayerFreely(arrester, data) {
    const arrestee = data.player;
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
    console.log(arrestee);
    console.log(arrester.cuffedPlayer.data.name);
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

export function friskPlayer(arrester, data) {
    const arrestee = data.player;
    const isOfficer =
        arrester.job && arrester.job.name.includes('Officer') ? true : false;
    const results = arrestee.searchItems();

    if (!results.hasDrugs && !results.hasWeapons) {
        const msg = `Frisks ${arrestee.data.name.replace('_', ' ')} and finds nothing.`;
        actionMessage(arrester, msg);
    }

    if (results.hasDrugs) {
        const msg = `Frisks ${arrestee.data.name.replace('_', ' ')} and finds drugs.`;
        actionMessage(arrester, msg);

        if (isOfficer) {
            appendToMdc('None - Frisked', arrestee, 'Drugs');
        }
    }

    if (results.hasWeapons) {
        const msg = `Frisks ${arrestee.data.name.replace('_', ' ')} and finds weapons.`;
        actionMessage(arrester, msg);

        if (isOfficer) {
            appendToMdc('None - Frisked', arrestee, 'Weapons');
        }
    }

    if (isOfficer) {
        cuffPlayer(arrester, arrestee);
    }
}

export function cuffPlayer(arrester, data) {
    const arrestee = data.player;
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

export function uncuffPlayer(arrester, data) {
    const arrestee = data.player;
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

export function fireExtinguisher(player) {
    const index = player.inventory.findIndex(x => x && x.name.includes('Extinguisher'));
    if (index > -1) {
        player.send('You already have one of those.');
        return;
    }

    addBoundWeapon(player, 'FireExtinguisher');
    player.send('You pick up the fire extinguisher.');
}

export function useDynamicDoor(player, data) {
    alt.emit('door:UseDynamicDoor', player, data);
}

export function exitDynamicDoor(player, id) {
    alt.emit('door:ExitDynamicDoor', player, id);
}

export function lockDynamicDoor(player, data) {
    alt.emit('door:LockDynamicDoor', player, data);
}

export function purchaseDynamicDoor(player, data) {
    alt.emit('door:PurchaseDynamicDoor', player, data);
}

export function cookFood(player, data) {
    const hashes = data.hashes;
    if (hashes.length <= 0) return;

    const skills = JSON.parse(player.data.skills);
    const cookingLVL = getLevel(skills.cooking.xp);

    const rawfood = player.inventory.filter(item => {
        if (item && hashes.includes(item.hash)) return item;
    });

    let allValid = true;
    rawfood.forEach(rawfood => {
        if (rawfood.props.lvl <= cookingLVL) return;
        allValid = false;
    });

    if (!allValid) {
        player.notify('An invalid cooking item was in your list.');
        return;
    }

    const totalCookable = Math.floor(cookingLVL / 7);

    player.cooking = {
        list: rawfood,
        time: Date.now(),
        cookable: totalCookable <= 0 ? 1 : totalCookable,
        position: data.position
    };

    player.notify('You begin cooking...');
}
