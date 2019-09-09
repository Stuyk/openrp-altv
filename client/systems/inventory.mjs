import * as alt from 'alt';
import * as native from 'natives';
import * as systemsSound from 'client/systems/sound.mjs';
import * as utilityVector from 'client/utility/vector.mjs';
import * as utilityText from 'client/utility/text.mjs';

alt.log('Loaded: client->systems->inventory.mjs');

const slots = {
    28: handleMask,
    29: handleHands,
    30: handleBody,
    31: handleBag,
    32: handleUniform
};

let itemsOnGround = [];
let pickingUpItem = false;
let interval;

// When the player updates their inventory.
alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) return;
    if (key !== 'inventory') return;

    const invData = JSON.parse(value);

    Object.keys(slots).forEach(key => {
        slots[key](invData[parseInt(key)]);
    });
});

function handleMask(data) {
    if (data === null || data === undefined || data.props === undefined) {
        native.clearPedProp(alt.Player.local.scriptID, 0);
        return;
    }
    // Equip
    if (native.isPedMale(alt.Player.local.scriptID)) {
        data.props.male.forEach(component => {
            if (!data.props.isProp) {
                native.setPedComponentVariation(
                    alt.Player.local.scriptID,
                    component.id,
                    component.value,
                    0,
                    0
                );
            } else {
                native.setPedPropIndex(
                    alt.Player.local.scriptID,
                    component.id,
                    component.value,
                    0,
                    true
                );
            }
        });
    } else {
        data.props.female.forEach(component => {
            if (!data.props.isProp) {
                native.setPedComponentVariation(
                    alt.Player.local.scriptID,
                    component.id,
                    component.value,
                    0,
                    0
                );
            } else {
                native.setPedPropIndex(
                    alt.Player.local.scriptID,
                    component.id,
                    component.value,
                    0,
                    true
                );
            }
        });
    }
}

function handleHands(data) {
    if (data === null || data === undefined || data.props === undefined) return;
}

function handleBody(data) {
    if (data === null || data === undefined || data.props === undefined) return;
}

function handleBag(data) {
    if (data === null || data === undefined || data.props === undefined) return;
}

function handleUniform(data) {
    if (data === null || data === undefined || data.props === undefined) return;

    // Equip
    if (native.isPedMale(alt.Player.local.scriptID)) {
        data.props.male.forEach(component => {
            native.setPedComponentVariation(
                alt.Player.local.scriptID,
                component.id,
                component.value,
                0,
                0
            );
        });
    } else {
        data.props.female.forEach(component => {
            native.setPedComponentVariation(
                alt.Player.local.scriptID,
                component.id,
                component.value,
                0,
                0
            );
        });
    }
}

export function itemDrop(player, item, randomPos) {
    if (alt.Player.local === player) {
        systemsSound.playAudio('drop');
    }

    itemsOnGround.push({ pos: randomPos, item });
    alt.setInterval(drawItems, 1);
}

export function itemPickup(hash) {
    if (alt.Player.local.vehicle) return;

    if (itemsOnGround.length <= 0) return;

    let index = itemsOnGround.findIndex(x => x.item.hash === hash);

    if (index <= -1) return;

    itemsOnGround.splice(index, 1);

    if (itemsOnGround.length <= 0) {
        pickingUpItem = false;
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }
    }
}

function drawItems() {
    if (itemsOnGround.length <= 0) {
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
        }

        pickingUpItem = false;
        return;
    }

    itemsOnGround.forEach(itemData => {
        let dist = utilityVector.distance(alt.Player.local.pos, itemData.pos);
        if (dist <= 5) {
            utilityText.drawText3d(
                itemData.item.label,
                itemData.pos.x,
                itemData.pos.y,
                itemData.pos.z - 1,
                0.4,
                4,
                255,
                255,
                255,
                255,
                true,
                false,
                99
            );

            if (dist <= 1) {
                native.beginTextCommandDisplayHelp('STRING');
                native.addTextComponentSubstringPlayerName(
                    `Press ~INPUT_CONTEXT~ to pick up the ${itemData.item.label}`
                );
                native.endTextCommandDisplayHelp(0, false, true, -1);

                if (native.isControlJustReleased(0, 38)) {
                    if (pickingUpItem) return;
                    pickingUpItem = true;
                    alt.emitServer('inventory:Pickup', itemData.item.hash);

                    alt.setTimeout(() => {
                        pickingUpItem = false;
                    }, 500);
                }
            }
        }
    });
}
