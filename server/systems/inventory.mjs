import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Loaded: systems->inventory.mjs');

const db = new SQL();

// Called when a player consumes an item.
alt.on('item:Consume', (player, itemObject) => {
    Object.keys(configurationItems.Items).forEach(key => {
        if (configurationItems.Items[key].label !== itemObject.label) return;

        const itemTemplate = configurationItems.Items[key];
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
        return;
    }

    player.data.inventory = JSON.stringify(player.inventory);
    player.saveField(player.data.id, 'inventory', player.data.inventory);
});

alt.on('inventory:AddItem', (player, index, quantity) => {
    player.inventory[index].quantity += quantity;
    player.data.inventory = JSON.stringify(player.inventory);
    player.saveField(player.data.id, 'inventory', player.data.inventory);
});
