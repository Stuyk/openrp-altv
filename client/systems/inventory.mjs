import * as alt from 'alt';
import * as native from 'natives';
import * as systemsSound from 'client/systems/sound.mjs';
import * as utilityVector from 'client/utility/vector.mjs';
import * as utilityText from 'client/utility/text.mjs';

let itemsOnGround = [];
let pickingUpItem = false;

export function itemDrop(player, item, randomPos) {
    if (alt.Player.local === player) {
        systemsSound.playAudio('drop');
    }

    itemsOnGround.push({ pos: randomPos, item });
    alt.on('update', drawItems);
}

export function itemPickup(hash) {
    if (itemsOnGround.length <= 0) return;

    let index = itemsOnGround.findIndex(x => x.item.hash === hash);

    if (index <= -1) return;

    itemsOnGround.splice(index, 1);

    if (itemsOnGround.length <= 0) {
        alt.off('update', drawItems);
        pickingUpItem = false;
    }
}

function drawItems() {
    if (itemsOnGround.length <= 0) {
        alt.off('update', drawItems);
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
