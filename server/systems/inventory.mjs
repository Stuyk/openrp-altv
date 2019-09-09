import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import * as utilityVector from '../utility/vector.mjs';
import * as utilityEncryption from '../utility/encryption.mjs';
console.log('Loaded: systems->inventory.mjs');

// hash, itemdata
let ItemDrops = new Map();

// Called when a player consumes an item.
alt.on('item:Consume', (player, itemObject) => {
    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== itemObject.label) return;

        const itemTemplate = configurationItems.Items[key];

        if (itemTemplate.sound !== undefined) {
            player.playAudio(itemTemplate.sound);
        }

        // animdict: 'mp_player_inteat@burger',
        // anim: 'mp_player_int_eat_burger_fp',
        // animflag: 49,
        // Play animation for player if available.
        if (itemTemplate.anim !== undefined) {
            player.playAnimation(
                itemTemplate.anim.dict,
                itemTemplate.anim.name,
                itemTemplate.anim.duration,
                itemTemplate.anim.flag
            );
        }

        alt.emit(itemTemplate.eventcall, player, itemObject.props, itemTemplate.message);
        return;
    });
});

// Called when a player uses an item.
alt.on('item:Use', (player, itemObject) => {
    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== itemObject.label) return;

        const itemTemplate = configurationItems.Items[key];

        if (itemTemplate.sound !== undefined) {
            player.playAudio(itemTemplate.sound);
        }

        if (itemTemplate.eventcall === undefined) return;

        alt.emit(itemTemplate.eventcall, player, itemObject.props, itemTemplate.message);
        return;
    });
});

// Remove an item from a player.
alt.on('inventory:SubItem', (player, index, quantity) => {
    player.inventory[index].quantity -= quantity;

    if (player.inventory[index].quantity <= 0) {
        player.inventory[index] = null;
        player.data.inventory = JSON.stringify(player.inventory);
        player.saveField(player.data.id, 'inventory', player.data.inventory);
        player.updateInventory();
        return;
    }

    player.data.inventory = JSON.stringify(player.inventory);
    player.saveField(player.data.id, 'inventory', player.data.inventory);
    player.updateInventory();
});

alt.on('inventory:AddItem', (player, index, quantity) => {
    player.inventory[index].quantity += quantity;
    player.data.inventory = JSON.stringify(player.inventory);
    player.saveField(player.data.id, 'inventory', player.data.inventory);
    player.setSyncedMeta('inventory', player.data.inventory);
    player.updateInventory();
});

export function use(player, hash) {
    let item = player.inventory.find(
        x => x !== null && x !== undefined && x.hash === hash
    );

    if (item === undefined) {
        player.updateInventory();
        return;
    }

    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== item.label) return;

        if (configurationItems.Items[key].consumeable) {
            player.consumeItem(hash);
        } else {
            player.useItem(hash);
        }
    });
}

export function drop(player, hash, quantity) {
    if (player.vehicle) {
        player.updateInventory();
        return;
    }

    let item = player.inventory.find(
        x => x !== null && x !== undefined && x.hash === hash
    );

    if (item === undefined) return;

    if (item.quantity < quantity) {
        player.updateInventory();
        return;
    }

    let isDroppable = true;
    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== item.label) return;
        isDroppable = configurationItems.Items[key].droppable;
    });

    if (!isDroppable) {
        player.send('You cannot drop that item.');
        player.updateInventory();
        return;
    }

    // Generate a clone of the object.
    let clonedItem = { ...item };
    clonedItem.quantity = parseInt(quantity);
    if (!player.subItemByHash(hash, parseInt(quantity))) return;

    // Regenerate new hash for each dropped item.
    let newHash = utilityEncryption.generateHash(JSON.stringify({ hash, clonedItem }));
    clonedItem.hash = newHash;

    // Setup the dropped item.
    ItemDrops.set(newHash, clonedItem);

    let randomPos = utilityVector.randPosAround(player.pos, 2);

    alt.emitClient(null, 'inventory:ItemDrop', player, clonedItem, randomPos);
}

export function destroy(player, hash) {
    player.destroyItem(hash);
}

export function pickup(player, hash) {
    if (player.pickingUpItem) return;

    if (!ItemDrops.has(hash)) return;

    player.pickingUpItem = true;

    let item = { ...ItemDrops.get(hash) };
    ItemDrops.delete(hash);

    alt.emitClient(null, 'inventory:ItemPickup', hash);

    player.playAudio('pickup');
    player.playAnimation('random@mugging4', 'pickup_low', 1200, 33);

    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== item.label) return;

        let clonedTemplate = { ...configurationItems.Items[key] };
        clonedTemplate.props = item.props;

        player.addItem(clonedTemplate, item.quantity);
    });

    player.pickingUpItem = false;
}

export function updatePosition(player, newIndex, oldIndex) {
    player.swapItems(newIndex, oldIndex);
}
