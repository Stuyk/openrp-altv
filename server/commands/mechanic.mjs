import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as systemsJob from '../systems/job.mjs';
import { distance, getClosestPlayer } from '../utility/vector.mjs';

/**
 * Find a player with the guid of 'mechanic'
 * Fulfill the rest.
 */
chat.registerCmd('mechanic', player => {
    if (player.data === undefined) return;
    if (player.jobber) return;
    if (player.job) {
        if (player.job.name === 'Mechanic Shop') {
            player.send(`{FF0000} Cannot request a mechanic as a mechanic.`);
            return;
        }
    }

    player.send('Requesting...');

    if (!player.lastVehicle) {
        player.send('{FF0000} Must enter a vehicle and exit to request repair.');
        return;
    }

    if (player.getCash() < 300) {
        player.send(`{FF0000}Must have $${300} on hand for a repair.`);
        return;
    }

    let mechanicDrivers = alt.Player.all.filter(
        x => x.job !== undefined && x.job.name === 'Mechanic Shop'
    );

    if (mechanicDrivers.length <= 0) {
        player.send('No mechanic is available at this time.');
        return;
    }

    let closestDriver = getClosestPlayer(player, mechanicDrivers, true);
    if (closestDriver === undefined) {
        player.send('No mechanic is available at this time.');
        return;
    }

    closestDriver.job.setTarget(
        closestDriver,
        player.lastVehicle,
        player.lastVehicle.pos,
        'Go to the destination; and hold ~INPUT_CONTEXT~ to assist the customer.',
        player
    );

    // Send the player a message notifying them.
    closestDriver.send('A customer is now waiting...');
    player.send('{FFFF00}A mechanic is enroute.');
    player.send(`{FFFF00}You will be charged $300 after this repair.`);
    player.send('{FFFF00}Stay near the vehicle.');
    player.jobber = {
        fare: 300,
        position: player.pos,
        employee: closestDriver,
        objectiveFare: true
    };
});

/**
 * Used to cancel a taxi fare.
 */
chat.registerCmd('mechaniccancel', player => {
    systemsJob.cancelTarget(player);
    player.send('Cancelled mechanic request.');
});
