import * as alt from 'alt';
import { Items } from '../configuration/items.mjs';

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
    4: Items.pants,
    5: Items.backpack,
    6: Items.shoes,
    7: Items.accessory,
    9: Items.bodyarmour,
    11: Items.shirt
};

const itemProps = {
    0: Items.hat,
    1: Items.glasses,
    2: Items.earrings,
    6: Items.watch,
    7: Items.bracelet
};

const blackList = {
    4: {
        male: [31],
        female: [30]
    },
    8: {
        male: [58],
        female: [35]
    },
    11: {
        male: [55],
        female: [48]
    }
};

// TODO: Implement cost.
export function purchase(player, jsonData) {
    let props = JSON.parse(jsonData);
    let type = 0;

    let invalid = false;
    Object.keys(props).forEach(key => {
        if (key === 'male') {
            type = props[key][0].id;
            if (!blackList[type]) return;
            if (blackList[type].male.includes(props[key][0].value)) {
                delete props[key];
                invalid = true;
            }
        }

        if (key === 'female') {
            type = props[key][0].id;
            if (!blackList[type]) return;
            if (blackList[type].female.includes(props[key][0].value)) {
                delete props[key];
                invalid = true;
            }
        }
    });

    if (invalid) {
        player.send('1 or more item was blacklisted from purchase.');
        player.playAudio('error');
        return;
    }

    let itemClone = props.isProp ? { ...itemProps[type] } : { ...items[type] };

    if (itemClone === undefined) {
        console.log(`ITEM WAS NOT FOUND FOR ${props}`);
        return;
    }

    delete props.label;
    delete props.description;

    if (!player.addItem(itemClone.key, 1, props)) {
        player.playAudio('error');
        return;
    }

    player.playAudio('buy');
}

export function resync(player) {
    player.syncInventory();
}
