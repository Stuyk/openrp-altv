import * as alt from 'alt';
import * as native from 'natives';
import * as systemsSound from '/client/systems/sound.mjs';
import * as utilityVector from '/client/utility/vector.mjs';
import * as utilityText from '/client/utility/text.mjs';
import * as utilityMarker from '/client/utility/marker.mjs';

let itemsOnGround = [];
let pickingUpItem = false;
let interval;

export function itemDrop(player, item, randomPos) {
    if (alt.Player.local === player) {
        systemsSound.playAudio('drop');
    }

    itemsOnGround.push({ pos: randomPos, item });
    const intervalID = alt.setInterval(drawItems, 1);
    alt.log(`inventory.mjs ${intervalID}`);
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

export function useRepairKit() {
    alt.Player.local.isRepairing = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to repair with your cursor.`
    );
}

export function useGasCan() {
    alt.Player.local.isUsingGasCan = true;
    alt.emit(
        'chat:Send',
        `{00FF00} Select the vehicle you want to re-fuel with your cursor.`
    );    
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
        if (dist > 15) return;

        // Questionable item on the ground seen from a distance
        if (dist <= 15 && dist >= 5) {
            utilityMarker.drawMarker(
                32, // question mark
                itemData.pos,
                new alt.Vector3(0, 0, 0),
                new alt.Vector3(0, 0, 0),
                new alt.Vector3(0.2, 0.2, 0.2),
                255,
                255,
                255,
                150
            );
        }

        // Closer up, we can recognize the item
        if (dist <= 5) {
            utilityText.drawText3d(
                `${itemData.item.name} x${itemData.item.quantity}`,
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

            // Close enough to pick it up
            if (dist <= 1) {
                native.beginTextCommandDisplayHelp('STRING');
                native.addTextComponentSubstringPlayerName(
                    `Press ~INPUT_CONTEXT~ to pickup (${itemData.item.name})`
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
