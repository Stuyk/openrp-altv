import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as systemsJob from '../systems/job.mjs';
import * as utilityVector from '../utility/vector.mjs';

/**
 * Find a player with the guid of 'mechanic'
 * Fulfill the rest.
 */
chat.registerCmd('mechanic', player => {
    if (player.data === undefined) return;

    player.send('Requesting...');

    if (!player.vehicle) {
        player.send('{FF0000}Must be inside the vehicle to request repair.');
        return;
    }

    if (player.getCash() < 300) {
        player.send(`{FF0000}Must have $${300} on hand for a repair.`);
        return;
    }

    let closestDriver = systemsJob.getClosestDriverByGuid(player, 'mechanic');

    if (closestDriver === undefined) {
        player.send('No mechanic is available at this time.');
        return;
    }

    if (!closestDriver.job.isAvailable) {
        player.send('No mechanic is available at this time.');
        return;
    }

    // Set the driver to unavailable.
    closestDriver.job.isAvailable = false;

    // Send the player a message notifying them.
    player.send('{FFFF00}A mechanic is now enroute.');

    // Process the callback for the driver.
    closestDriver.job.processTarget(player, {
        fare: 300,
        vehicle: player.vehicle
    });
});

/**
 * Used to cancel a taxi fare.
 */
chat.registerCmd('mechaniccancel', player => {
    systemsJob.cancelTarget(player);
});
