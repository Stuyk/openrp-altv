import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import * as utilityVector from '../utility/vector.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Loaded: systems->inventory.mjs');

const db = new SQL();

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

        alt.emit(
            itemTemplate.eventcall,
            player,
            itemObject.props,
            itemTemplate.message
        );
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

        alt.emit(
            itemTemplate.eventcall,
            player,
            itemObject.props,
            itemTemplate.message
        );
        return;
    });
});

// Remove an item from a player.
alt.on('inventory:SubItem', (player, index, quantity) => {
    player.inventory[index].quantity -= quantity;

    if (player.inventory[index].quantity <= 0) {
        player.inventory.splice(index, 1);
        player.data.inventory = JSON.stringify(player.inventory);
        player.saveField(player.data.id, 'inventory', player.data.inventory);
        player.updateInventory();
        return;
    }

    player.data.inventory = JSON.stringify(player.inventory);
    player.saveField(player.data.id, 'inventory', player.data.inventory);
    player.setSyncedMeta('inventory', player.data.inventory);
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
    var item = player.inventory.find(x => x.hash === hash);

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

export function drop(player, hash) {
    var item = player.inventory.find(x => x.hash === hash);

    if (item === undefined) return;

    ItemDrops.set(hash, item);

    if (!player.subItemByHash(hash, 1)) return;

    let randomPos = utilityVector.randPosAround(player.pos, 5);

    alt.emitClient(null, 'inventory:ItemDrop', player, item, randomPos);
}

export function destroy(player, hash) {
    player.destroyItem(hash);
}

export function pickup(player, hash) {
    alt.emitClient(null, 'inventory:ItemPickup', hash);

    if (!ItemDrops.has(hash)) return;

    player.playAudio('pickup');

    let item = { ...ItemDrops.get(hash) };
    ItemDrops.delete(hash);

    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== item.label) return;

        let clonedTemplate = { ...configurationItems.Items[key] };
        clonedTemplate.props = item.props;

        player.addItem(clonedTemplate, 1);
    });
}
