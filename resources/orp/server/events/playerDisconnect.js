import * as alt from 'alt';
import { quitJob, quitTarget } from '../systems/job.js';

alt.on('playerDisconnect', player => {
    if (!player) return;

    // If the player isn't logged in; don't do anything else.
    if (player.guid === undefined) {
        alt.log(`${player.name} has disconnected.`);
        return;
    }

    // Check if the player has character data.
    if (player.data === undefined) {
        alt.log(`${player.name} has disconnected.`);
        return;
    }

    if (player.vehicles && player.vehicles.length >= 1) {
        player.vehicles.forEach(vehicle => {
            if (!vehicle) {
                return;
            }

            try {
                vehicle.destroy();
            } catch (err) {
                alt.log(`Could not destroy vehicle; probably doesn't exist.`);
            }
        });
    }

    alt.emit('logout:Player', player);

    // Attempt to Quit Jobs / Target Jobs
    try {
        quitTarget(player);
        quitJob(player, true);
    } catch (err) {
        console.log(err);
    }
});
