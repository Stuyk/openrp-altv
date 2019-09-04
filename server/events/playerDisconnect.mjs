import * as alt from 'alt';
import * as registrationLogin from '../registration/login.mjs';
import * as systemsJob from '../systems/job.mjs';
import * as utilityTime from '../utility/time.mjs';

console.log('Loaded: events->playerDisconnect.mjs');

alt.on('playerDisconnect', player => {
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

    // Set the player's playing time for the session.
    player.updatePlayingTime();
    player.data.lastposition =
        player.lastLocation !== undefined
            ? JSON.stringify(player.lastLocation)
            : JSON.stringify(player.pos);
    player.data.health = player.health;
    player.data.armour = player.armour;
    player.save();
    registrationLogin.removeLoggedInPlayer(player.username);
    alt.log(`${player.username} has disconnected.`);

    try {
        // Has character data at this point.
        clearTimeout(player.reviveTimeout);
        clearTimeout(player.loginHealth);

        // Clear Job Data
        if (player.jobOwner !== undefined && player.inJobVehicle) {
            systemsJob.exitFee(player, player.jobOwner);
        }

        systemsJob.cancelJob(player);
    } catch (err) {
        console.log(err);
    }
});
