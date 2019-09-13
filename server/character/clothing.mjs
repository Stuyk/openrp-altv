import * as alt from 'alt';
import * as configurationItems from '../configuration/items.mjs';
import { dropNewItem } from '../systems/inventory.mjs';

console.log('Loaded: character->clothing.mjs');

/*
28 - Hat
29 - Helmet
30 - Shirt
31 - Pants
32 - Shoes
33 - Body Armor
34 - Accessory
35 - Ears
36 - Backpack
37 - Hand
38 - Watch
39 - Bracelet
40 - Glasses
41 - Uniform
*/

const items = {
    4: configurationItems.Items['Pants'],
    5: configurationItems.Items['Backpack'],
    6: configurationItems.Items['Shoes'],
    7: configurationItems.Items['Accessory'],
    9: configurationItems.Items['BodyArmour'],
    11: configurationItems.Items['Shirt']
};

const itemProps = {
    0: configurationItems.Items['Hat'],
    1: configurationItems.Items['Glasses'],
    2: configurationItems.Items['Earrings'],
    6: configurationItems.Items['Watch'],
    7: configurationItems.Items['Bracelet']
};

// TODO: Implement cost.
export function purchase(player, jsonData) {
    let props = JSON.parse(jsonData);
    let type = 0;

    Object.keys(props).forEach(key => {
        if (key === 'male') {
            type = props[key][0].id;
        }

        if (key === 'female') {
            type = props[key][0].id;
        }
    });

    let itemClone = props.isProp ? { ...itemProps[type] } : { ...items[type] };

    if (itemClone === undefined) {
        console.log(`ITEM WAS NOT FOUND FOR ${props}`);
        return;
    }

    itemClone.props = props;
    if (!player.addItem(itemClone, 1)) {
        player.playAudio('error');
        return;
    }

    player.playAudio('buy');
}

export function resync(player) {
    player.syncInventory();
}
