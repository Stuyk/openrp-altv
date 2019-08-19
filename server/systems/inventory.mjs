import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';

alt.on('item:Consume', (player, itemName) => {
    const itemData = configurationItems.Items[itemName];

    if (itemData === undefined) return;

    // Emit the data to the event named in the configuration.
    if (itemData.eventcall.length > 0) {
        alt.emit(itemData.eventcall, player, itemData.props, itemData.message);
    }
});

alt.on('item:UseItem', (player, itemName) => {
    const itemData = configurationItems.Items[itemName];

    if (itemData === undefined) return;

    // Emit the data to the event named in the configuration.
    if (itemData.eventcall.length > 1) {
        alt.emit(`${itemData.eventcall}`, player, itemData);
    }
});
