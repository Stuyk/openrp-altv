import * as alt from 'alt';
import * as utilityVector from '../utility/vector.js';
import { generateHash } from '../utility/encryption.js';
import { BaseItems, Items } from '../configuration/items.js';
import { Weapons } from '../configuration/weapons.js';
import { objectToNull } from '../utility/object.js';
import { actionMessage } from '../chat/chat.js';

// hash, itemdata
let ItemDrops = new Map();

export function rename(player, hash, newName) {
    let index = player.inventory.findIndex(
        x => x !== null && x !== undefined && x.hash === hash
    );

    if (index <= -1) {
        player.updateInventory();
        return;
    }

    if (!player.inventory[index].rename) {
        player.updateInventory();
        player.send(`You can't rename that item.`);
        return;
    }

    if (newName.length >= 20) {
        player.updateInventory();
        player.send(`New name is too long.`);
        return;
    }

    if (newName.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
        player.updateInventory();
        player.send(`New name cannot contain symbols.`);
        return;
    }

    newName = newName.replace(' ', '_');

    player.inventory[index].label = newName;
    player.data.inventory = JSON.stringify(player.inventory);
    player.setSyncedMeta('inventory', player.data.inventory);
    player.saveField(player.data.id, 'inventory', player.data.inventory);
}

export function use(player, hash) {
    const item = player.inventory.find(item => {
        if (item && item.hash === hash) return item;
    });

    if (!item) {
        player.syncInventory();
        return;
    }

    const baseItem = BaseItems[item.base];

    if (!baseItem) {
        console.log(`${baseItem} is not defined for use.`);
        player.syncInventory();
        return;
    }

    if (Array.isArray(baseItem.eventcall)) {
        baseItem.eventcall.forEach(event => {
            if (event === '') {
                player.syncInventory();
                return;
            }

            alt.emit(event, player, item, hash);
        });
    } else {
        if (baseItem.eventcall === '') {
            player.syncInventory();
            return;
        }

        alt.emit(baseItem.eventcall, player, item, hash);
    }

    player.notify(`Used: ${item.name} 1x`);
}

export function unequipItem(player, hash) {
    const index = player.equipment.findIndex(item => {
        if (item && item.hash === hash) return item;
    });

    if (index <= -1) {
        player.syncInventory();
        return;
    }

    player.unequipItem(index);
}

export function splitItem(player, hash) {
    const index = player.inventory.findIndex(item => {
        if (item && item.hash === hash) return item;
    });

    if (index <= -1) {
        player.syncInventory();
        return;
    }

    player.splitItem(index);
}

export function dropNewItem(pos, item) {
    const baseItem = BaseItems[item.base];

    if (!baseItem) {
        return;
    }

    if (!baseItem.abilities.drop) {
        return;
    }

    const result = objectToNull(item);
    if (!result) {
        return;
    }

    // Generate a clone of the object.
    const clonedItem = item;

    // Regenerate new hash for each dropped item.
    let newHash = generateHash(JSON.stringify({ hash: item.hash, clonedItem }));
    clonedItem.hash = newHash;

    // Setup the dropped item.
    ItemDrops.set(newHash, clonedItem);
    const randomPos = utilityVector.randPosAround(pos, 2);
    alt.emitClient(null, 'inventory:ItemDrop', null, clonedItem, randomPos);
}

export function drop(player, hash) {
    if (player.isDropping) {
        player.syncInventory();
        return;
    }

    player.isDropping = true;

    if (player.vehicle) {
        player.syncInventory();
        player.isDropping = false;
        return;
    }

    let index = player.inventory.findIndex(i => {
        if (i && i.hash === hash) return i;
    });

    if (index <= -1) {
        player.syncInventory();
        player.isDropping = false;
        return;
    }

    const baseItem = BaseItems[player.inventory[index].base];

    if (!baseItem) {
        player.syncInventory();
        player.isDropping = false;
        return;
    }

    if (!baseItem.abilities.drop) {
        player.send(`You cannot drop this item.`);
        player.syncInventory();
        player.isDropping = false;
        return;
    }

    // Generate a clone of the object.
    const clonedItem = { ...player.inventory[index] };
    player.removeItem(index);

    // Regenerate new hash for each dropped item.
    let newHash = generateHash(JSON.stringify({ hash, clonedItem }));
    clonedItem.hash = newHash;

    // Setup the dropped item.
    ItemDrops.set(newHash, clonedItem);

    player.notify(`Dropped: ${clonedItem.name} ${clonedItem.quantity}x`);
    const randomPos = utilityVector.randPosAround(player.pos, 2);
    alt.emitClient(null, 'inventory:ItemDrop', player, clonedItem, randomPos);
    player.isDropping = false;
}

export function destroy(player, hash) {
    const index = player.inventory.findIndex(item => {
        if (item && item.hash === hash) return item;
    });

    if (index <= -1) {
        player.syncInventory();
        return;
    }

    const item = player.inventory[index];
    actionMessage(player, `Destroyed ${item.name}.`);
    player.notify(`Destroyed: ${item.name} ${item.quantity}x`);
    player.removeItem(index);
}

export function pickup(player, hash) {
    if (player.pickingUpItem) return;
    if (!ItemDrops.has(hash)) return;
    player.pickingUpItem = true;

    const item = { ...ItemDrops.get(hash) };
    ItemDrops.delete(hash);

    if (!player.addClonedItem(item)) {
        ItemDrops.set(hash, item);
        player.pickingUpItem = false;
        return;
    }

    alt.emitClient(null, 'inventory:ItemPickup', hash);
    player.playAudio('pickup');
    player.playAnimation('random@mugging4', 'pickup_low', 1200, 33);
    player.pickingUpItem = false;
}

export function addWeapon(player, weaponName, name = undefined) {
    let weapon;
    Object.keys(Weapons).forEach(key => {
        if (key.toLowerCase() !== weaponName.toLowerCase()) return;
        weapon = {
            name: key,
            value: Weapons[key]
        };
    });

    if (!weapon) return false;
    const useCustomName = name !== undefined ? name : weapon.name;

    const props = {
        hash: weapon.value
    };

    player.addItem('weapon', 1, props, false, false, useCustomName);
    return true;
}

export function addBoundWeapon(player, weaponName, name = undefined) {
    let weapon;
    Object.keys(Weapons).forEach(key => {
        if (key.toLowerCase() !== weaponName.toLowerCase()) return;
        weapon = {
            name: key,
            value: Weapons[key]
        };
    });

    if (!weapon) return false;
    const useCustomName = name !== undefined ? name : weapon.name;

    const props = {
        hash: weapon.value
    };

    player.addItem('boundweapon', 1, props, false, false, useCustomName);
    return true;
}
