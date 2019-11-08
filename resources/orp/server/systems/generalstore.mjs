import * as alt from 'alt';
import { GeneralStore } from '../configuration/generalstore.mjs';
import { BaseItems, Items } from '../configuration/items.mjs';

export function getItems(player) {
    let items = [];
    Object.keys(GeneralStore).forEach(key => {
        items.push(GeneralStore[key]);
    });
    alt.emitClient(player, 'general:Items', JSON.stringify(items));
}

export function buyItem(player, itemKey) {
    const generalItem = GeneralStore[itemKey];
    if (!generalItem) {
        player.notify('That item does not exist.');
        return;
    }

    if (!Items[generalItem.key]) {
        player.notify('That item does not exist.');
        return;
    }

    if (player.getCash() < generalItem.price) {
        player.notify('You do not have enough money on hand.');
        player.playAudio('error');
        return;
    }

    // key, quantity, props = {}, skipStackable = false, skipSave = false, name = undefined
    if (!player.addItem(Items[generalItem.key].key, 1, Items[generalItem.key].props)) {
        player.notify('Unable to add item to inventory.');
        player.playAudio('error');
        return;
    }

    player.subCash(generalItem.price);
    player.playAudio('buy');
    player.notify(`Purchased ${Items[generalItem.key].name}`);
}
