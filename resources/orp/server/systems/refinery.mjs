import * as alt from 'alt';
import { addXP } from '../systems/skills.mjs';

alt.onClient('refinery:UseUnrefinedMetal', useUnrefinedMetal);
alt.onClient('refinery:PickupMetal', pickupMetal);

function useUnrefinedMetal(player) {
    if (!player.subItem('unrefinedmetal', 1)) {
        player.notify('You do not have any unrefined metal.');
        return;
    }

    if (!player.pendingMetal) {
        player.pendingMetal = 1;
    } else {
        player.pendingMetal += 1;
    }

    player.notify('Metal has been added to the queue.');
    alt.emitClient(player, 'refinery:SpawnMetal');
}

function pickupMetal(player) {
    if (!player.pendingMetal) {
        player.notify('You have no metal to pick up.');
        return;
    }

    if (player.pendingMetal <= 0) {
        player.notify('You have no metal to pick up.');
        return;
    }

    player.pendingMetal -= 1;
    if (!player.addItem('refinedmetal', 1, {})) {
        player.notify('Not enough room in inventory.');
        return;
    }

    addXP(player, 'smithing', Math.floor(Math.random() * 25) + 25);
    player.notify('Added x1 Refined Metal');
}
