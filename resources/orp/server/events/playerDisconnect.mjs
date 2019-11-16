import * as alt from 'alt';
import * as registrationLogin from '../registration/login.mjs';
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

    // UnArrest on Disconnect
    if (player.cuffedPlayer) {
        player.cuffedPlayer.setSyncedMeta('arrested', undefined);
        player.cuffedPlayer.emitMeta('arrest', undefined);
    }

    // Set the player's playing time for the session.
    player.updatePlayingTime();
    player.data.lastposition =
        player.lastLocation !== undefined
            ? JSON.stringify(player.lastLocation)
            : JSON.stringify(player.pos);
    player.data.health = player.health;
    player.data.armour = player.armour;

    // Arrest has highest prioirty.
    if (player.isArrested) {
        player.data.lastposition = JSON.stringify({
            x: 459.00830078125,
            y: -998.204833984375,
            z: 24.91485023498535
        });
    }

    player.save();
    registrationLogin.removeLoggedInPlayer(player.username);
    alt.log(`${player.username} has disconnected.`);

    try {
        quitTarget(player);
        quitJob(player, true);
    } catch (err) {
        console.log(err);
    }
});
