import * as alt from 'alt';
import { GeneralStore } from '../configuration/generalstore.mjs';
import { BaseItems, Items } from '../configuration/items.mjs';

export function getItems(player, storeKey = 'general') {
    if (!GeneralStore[storeKey]) return;

    let items = [];
    Object.keys(GeneralStore[storeKey]).forEach(key => {
        items.push(GeneralStore[storeKey][key]);
    });

    alt.emitClient(player, 'general:Items', JSON.stringify(items));
}

export function buyItem(player, shopType, itemKey, amount) {
    if (isNaN(amount) || amount <= 0) {
        return;
    }

    amount = parseFloat(amount);

    const generalStore = GeneralStore[shopType];
    const generalItem = generalStore[itemKey];
    if (!generalItem) {
        player.notify('That item does not exist.');
        player.playAudio('error');
        return;
    }

    if (player.getNullSlots() < amount) {
        player.notify(`You have no room for ${amount} items.`);
        player.playAudio('error');
        return;
    }

    if (player.getCash() < generalItem.price * amount) {
        player.notify('You do not have enough money on hand.');
        player.playAudio('error');
        return;
    }

    if (!generalItem.unique) {
        if (!Items[generalItem.key]) {
            player.notify('That item does not exist.');
            return;
        }

        const itemKey = Items[generalItem.key].key;
        const itemProps = Items[generalItem.key].props;

        // key, quantity, props = {}, skipStackable = false, skipSave = false, name = undefined
        if (!player.addItem(itemKey, amount, itemProps)) {
            player.notify('Unable to add item to inventory.');
            player.playAudio('error');
            return;
        }
    } else {
        const props = generalItem.props ? generalItem.props : {};
        for (let i = 0; i < amount; i++) {
            if (
                !player.addItem(
                    'ingredient',
                    1,
                    props, // Properties
                    false,
                    false,
                    generalItem.name, // Name Override
                    generalItem.key, // Icon
                    generalItem.key // Key Override
                )
            ) {
                player.notify('Unable to add item to inventory.');
                player.playAudio('error');
                return;
            }
        }
    }

    player.subCash(generalItem.price * amount);
    player.playAudio('buy');
    player.notify(`Purchased ${amount}x ${generalItem.name}(s)`);
}
