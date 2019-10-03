import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->inventory.mjs');

let currentSlots = new Map();
let isPedMale;

// When the player updates their inventory.
alt.on('meta:Changed', (key, value) => {
    if (key !== 'equipment') return;

    const invData = JSON.parse(value);

    // Equippable Item Count
    for (let i = 0; i < 15; i++) {
        equipItem(invData[i], i);
    }
});

const equipItem = (item, slot) => {
    // Unequip
    if (!item) {
        const ped = alt.Player.local.scriptID;
        isPedMale = native.isPedMale(alt.Player.local.scriptID);

        // Hat
        if (slot === 1) {
            native.clearPedProp(ped, 0, -1);
            native.setPedPropIndex(ped, 0, -1, 0, 0);
            alt.emit('face:UpdateHair');
        }

        // Helmet === 4?

        // Accessory
        if (slot === 0) {
            native.setPedComponentVariation(ped, 7, -1, 0, 0);
        }

        // Shirt
        if (slot === 7) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 11, 15, 0, 0);
                native.setPedComponentVariation(ped, 8, 15, 0, 0);
                native.setPedComponentVariation(ped, 3, 15, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 11, 15, 0, 0);
                native.setPedComponentVariation(ped, 8, 14, 0, 0);
                native.setPedComponentVariation(ped, 3, 15, 0, 0);
            }
        }

        // Pants
        if (slot === 10) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 4, 21, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 4, 15, 0, 0);
            }
        }

        // Shoes
        if (slot === 13) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 6, 34, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 6, 35, 0, 0);
            }
        }

        // Body Armor
        if (slot === 8) {
            native.setPedComponentVariation(ped, 9, -1, 0, 0);
        }

        // Ears
        if (slot === 2) {
            native.clearPedProp(ped, 2, -1);
            native.setPedPropIndex(ped, 2, -1, 0, 0);
            alt.emit('face:UpdateHair');
        }

        // Backpack
        if (slot === 6) {
            native.setPedComponentVariation(ped, 5, -1, 0, 0);
        }

        if (slot === 11) {
            // Hand
        }

        // Watch
        if (slot === 5) {
            native.clearPedProp(ped, 6, -1);
            native.setPedPropIndex(ped, 6, -1, 0, 0);
        }

        // Bracelet
        if (slot === 9) {
            native.clearPedProp(ped, 7, -1);
            native.setPedPropIndex(ped, 7, -1, 0, 0);
            alt.emit('face:UpdateHair');
        }

        // Glasses
        if (slot === 3) {
            native.clearPedProp(ped, 1, -1);
            native.setPedPropIndex(ped, 1, -1, 0, 0);
            alt.emit('face:UpdateHair');
        }

        // Handle Pre-equipped Item
        currentSlots.set(slot, item);
        return;
    }

    // Setup Item Array
    let isMale = native.isPedMale(alt.Player.local.scriptID);
    let itemArray = isMale ? item.props.male : item.props.female;

    if (item.props.restriction >= 0) {
        if (!itemArray) {
            alt.log('This item cannot be equipped by you.');
            return;
        }
    } else {
        itemArray = isMale ? item.props.male : item.props.female;
    }

    if (itemArray === undefined) {
        return;
    }

    if (item.props.isProp) {
        for (let i = 0; i < itemArray.length; i++) {
            native.clearPedProp(alt.Player.local.scriptID, itemArray[i].id);
            native.setPedPropIndex(
                alt.Player.local.scriptID,
                itemArray[i].id,
                itemArray[i].value,
                itemArray[i].texture,
                true
            );

            if (itemArray[i].id === 0) {
                alt.emit('updateHair');
            }
        }
    } else {
        for (let i = 0; i < itemArray.length; i++) {
            native.setPedComponentVariation(
                alt.Player.local.scriptID,
                itemArray[i].id,
                itemArray[i].value,
                itemArray[i].texture,
                0
            );
        }
    }

    currentSlots.set(slot, item);
};
