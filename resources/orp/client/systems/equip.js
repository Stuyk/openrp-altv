import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->inventory.js');

let currentSlots = new Map();
let isPedMale;

const SLOT = {
    ACCESSORY: 0,
    HAT: 1,
    MASK: 4,
    SHIRT: 7,
    PANTS: 10,
    SHOES: 13,
    BODYARMOUR: 8,
    EARS: 2,
    BACKPACK: 6,
    HAND: 11,
    WATCH: 5,
    BRACELET: 9,
    GLASSES: 3
};

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

        if (slot === SLOT.HAT) {
            native.clearPedProp(ped, 0, -1);
            native.setPedPropIndex(ped, 0, -1, 0, 1);
            alt.emit('face:UpdateHair');
        }

        if (slot === SLOT.MASK) {
            native.setPedComponentVariation(ped, 1, 0, 0, 0);
        }

        if (slot === SLOT.ACCESSORY) {
            native.setPedComponentVariation(ped, 7, -1, 0, 0);
        }

        if (slot === SLOT.SHIRT) {
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

        if (slot === SLOT.PANTS) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 4, 21, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 4, 15, 0, 0);
            }
        }

        if (slot === SLOT.SHOES) {
            if (isPedMale) {
                native.setPedComponentVariation(ped, 6, 34, 0, 0);
            } else {
                native.setPedComponentVariation(ped, 6, 35, 0, 0);
            }
        }

        if (slot === SLOT.BODYARMOUR) {
            native.setPedComponentVariation(ped, 9, -1, 0, 0);
        }

        if (slot === SLOT.EARS) {
            native.clearPedProp(ped, 2, -1);
            native.setPedPropIndex(ped, 2, -1, 0, 0);
            alt.emit('face:UpdateHair');
        }

        if (slot === SLOT.BACKPACK) {
            native.setPedComponentVariation(ped, 5, -1, 0, 0);
        }

        if (slot === SLOT.HAND) {
            // Hand
        }

        if (slot === SLOT.WATCH) {
            native.clearPedProp(ped, 6, -1);
            native.setPedPropIndex(ped, 6, -1, 0, 0);
        }

        if (slot === SLOT.BRACELET) {
            native.clearPedProp(ped, 7, -1);
            native.setPedPropIndex(ped, 7, -1, 0, 0);
            alt.emit('face:UpdateHair');
        }

        if (slot === SLOT.GLASSES) {
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
