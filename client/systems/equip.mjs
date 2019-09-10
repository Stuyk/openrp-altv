import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->inventory.mjs');

const slots = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
let currentSlots = new Map();

let isPedMale;

// When the player updates their inventory.
alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) return;
    if (key !== 'inventory') return;

    // Get Gender
    if (isPedMale === undefined) isPedMale = native.isPedMale(alt.Player.local.scriptID);

    const invData = JSON.parse(value);
    slots.forEach(key => {
        equipItem(invData[parseInt(key)], key);
    });
});

const isItemInvalid = item => {
    if (item === null || item === undefined || !item.props) return true;
    return false;
};

const isItemMale = item => {
    if (item.props.male) return true;
    return false;
};

const equipItem = (item, slot) => {
    // Unequip
    if (isItemInvalid(item)) {
        const ped = alt.Player.local.scriptID;

        // Hat
        if (slot === 28) {
            native.clearPedProp(ped, 0, -1);
            native.setPedPropIndex(ped, 0, -1, 0, 0);
            alt.emit('updateHair');
        }

        // Shirt
        if (slot === 30) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 11, -1, 0, 0);
                native.setPedComponentVariation(ped, 8, -1, 0, 0);
                native.setPedComponentVariation(ped, 3, 15, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 11, 15, 0, 0);
                native.setPedComponentVariation(ped, 8, -1, 0, 0);
                native.setPedComponentVariation(ped, 3, 15, 0, 0);
            }
        }

        // Pants
        if (slot === 31) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 4, 21, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 4, 15, 0, 0);
            }
        }

        // Shoes
        if (slot === 32) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 6, 34, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 6, 35, 0, 0);
            }
        }

        // Body Armor
        if (slot === 33) {
            native.setPedComponentVariation(ped, 9, -1, 0, 0);
        }

        // Accessory
        if (slot === 34) {
            native.setPedComponentVariation(ped, 7, -1, 0, 0);
        }

        // Ears
        if (slot === 35) {
            native.clearPedProp(ped, 2, -1);
            native.setPedPropIndex(ped, 2, -1, 0, 0);
            alt.emit('updateHair');
        }

        // Backpack
        if (slot === 36) {
            native.setPedComponentVariation(ped, 5, -1, 0, 0);
        }

        if (slot === 37) {
            // Hand
        }

        // Watch
        if (slot === 38) {
            native.clearPedProp(ped, 6, -1);
            native.setPedPropIndex(ped, 6, -1, 0, 0);
        }

        // Bracelet
        if (slot === 39) {
            native.clearPedProp(ped, 7, -1);
            native.setPedPropIndex(ped, 7, -1, 0, 0);
            alt.emit('updateHair');
        }

        // Glasses
        if (slot === 40) {
            native.clearPedProp(ped, 1, -1);
            native.setPedPropIndex(ped, 1, -1, 0, 0);
            alt.emit('updateHair');
        }

        // Handle Pre-equipped Item
        currentSlots.set(slot, item);
        return;
    }

    // Setup Item Array
    const isMaleItem = isItemMale(item);
    let itemArray = item.props.male ? item.props.male : item.props.female;

    if (item.props.restriction >= 0) {
        if (isPedMale && !isMaleItem) {
            alt.log('This item cannot be equipped by a male.');
            return;
        }

        if (!isPedMale && isMaleItem) {
            alt.log('This item cannot be equipped by a female.');
            return;
        }
    } else {
        itemArray = isPedMale ? item.props.male : item.props.female;
    }

    if (itemArray === undefined) {
        alt.log('This item is not equippable for you.');
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
