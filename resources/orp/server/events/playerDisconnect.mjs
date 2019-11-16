import * as alt from 'alt';
import { quitJob, quitTarget } from '../systems/job.mjs';

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

    alt.emit('logout:Player', player);

    // Attempt to Quit Jobs / Target Jobs
    try {
        quitTarget(player);
        quitJob(player, true);
    } catch (err) {
        console.log(err);
    }
});
