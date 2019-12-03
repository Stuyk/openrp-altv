import * as alt from 'alt';
import { getPlayersInRange } from '../utility/vector.mjs';

const planksToSpawn = 3;

alt.onClient('lumber:UseUnrefinedWood', (player, data) => {
    const amount = data.amount;
    if (amount > 5 || amount <= 0) {
        alt.log(`${player.data.name} attempted to modify lumber yard amounts.`);
        player.kick();
        return;
    }

    if (!player.subItem('unrefinedwood', 1)) {
        player.notify('You do not have any unrefined wood.');
        return;
    }

    if (!player.pendingLogs) {
        player.pendingLogs = amount * planksToSpawn;
    } else {
        player.pendingLogs += amount * planksToSpawn;
    }

    const players = getPlayersInRange(player.pos, 10);
    players.forEach(target => {
        alt.emitClient(target, 'lumber:SpawnLog', player);
    });
});

alt.onClient('lumber:FinishLog', player => {
    if (!player.pendingLogs) {
        return;
    }

    if (player.pendingLogs <= 0) {
        return;
    }

    player.notify('Planks are ready to be picked up.');
    player.pendingLogs -= 1;

    if (!player.pendingLogPickups) {
        player.pendingLogPickups = 3;
    } else {
        player.pendingLogPickups += 3;
    }

    alt.emitClient(player, 'lumber:SpawnPlanks');
});

alt.onClient('lumber:Pickup', player => {
    if (!player.pendingLogPickups) {
        player.notify('You have no lumber to pick up.');
        return;
    }

    if (player.pendingLogPickups <= 0) {
        player.notify('You have no lumber to pick up.');
        return;
    }

    player.pendingLogPickups -= 1;
    if (!player.addItem('refinedwood', 1, {})) {
        player.notify('Not enough room in inventory.');
        return;
    }

    player.notify('Added x1 Refined Wood');
});
