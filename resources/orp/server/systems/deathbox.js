import * as alt from 'alt';
import { BaseItems, Items } from '../configuration/items.js';
import { persistentHash } from '../utility/encryption.js';

const deathBoxes = [];

alt.onClient('deathbox:Pickup', deathboxPickup);
alt.on('deathbox:Create', deathboxCreate);

export class Deathbox {
    constructor(player) {
        this.expiration = Date.now() + 60000 * 7;
        this.items = [];
        this.pos = { ...player.pos };
        player.inventory.forEach(item => {
            if (!item) {
                return;
            }

            const baseItem = BaseItems[item.base];
            if (baseItem) {
                if (!baseItem.abilities.drop) {
                    return;
                }
            }

            const clone = { ...item };
            if (!player.subItemByHash(item.hash)) {
                return;
            }

            this.items.push(clone);
        });

        if (player.equipment[11]) {
            if (player.equipment[11].base !== 'boundweapon') {
                this.items.push({ ...player.equipment[11] });
            }

            player.equipment[11] = null;
            player.data.equipment = JSON.stringify(player.equipment);
            player.saveField(player.data.id, 'equipment', player.data.equipment);
        }

        const hashDat =
            JSON.stringify(this) + player.data.name + `${Math.random() * 10000}`;
        this.hash = persistentHash(hashDat);
        deathBoxes.push(this);
        return this;
    }

    retrieveItem(player, hash) {
        if (player.pickingUpItem) {
            return;
        }

        player.pickingUpItem = true;

        const itemIndex = this.items.findIndex(item => item.hash === hash);

        if (itemIndex <= -1) {
            player.notify('Item was claimed already.');
            player.pickingUpItem = false;
            return;
        }

        const oldItem = this.items[itemIndex];

        let item = { ...oldItem };
        this.items.splice(itemIndex, 1);

        if (
            !player.addItem(item.key, item.quantity, item.props, false, false, item.name)
        ) {
            this.items.push(item);
            player.pickingUpItem = false;
            return;
        }

        player.playAudio('pickup');
        player.playAnimation('random@mugging4', 'pickup_low', 1200, 33);
        player.pickingUpItem = false;
        this.emptyCheck();
    }

    emptyCheck() {
        if (this.items.length <= 0) {
            const index = deathBoxes.findIndex(box => box.hash === this.hash);
            if (index <= -1) {
                return;
            }

            deathBoxes.splice(index, 1);
        }

        alt.emitClient(null, 'deathbox:Sync', JSON.stringify(deathBoxes));
    }
}

function deathboxPickup(player, data) {
    const boxHash = data.boxhash;
    const hash = data.hash;

    const index = deathBoxes.findIndex(box => {
        if (box.hash === boxHash) {
            return box;
        }
    });

    if (index <= -1) {
        return;
    }

    const box = deathBoxes[index];
    box.retrieveItem(player, hash);
}

function deathboxCreate(player) {
    if (!player.valid) {
        return;
    }

    if (!player.inventory) {
        return;
    }

    new Deathbox(player);
    alt.emitClient(null, 'deathbox:Sync', JSON.stringify(deathBoxes));
}
