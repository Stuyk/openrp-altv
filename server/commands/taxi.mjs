import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as systemsJob from '../systems/job.mjs';
import * as utilityVector from '../utility/vector.mjs';

/**
 * Find a player with the guid of 'taxi'
 * Request a waypoint from clientside.
 * Fulfill the rest.
 */
chat.registerCmd('taxi', player => {
    if (player.data === undefined) return;

    // Setup the Callback
    let callbackname = `${player.name}:Waypoint`;
    alt.onClient(callbackname, callbackWaypoint);

    //
    player.send('Requesting...');

    // Setup Promise
    player.taxi = (value, pos) => {
        player.taxi = undefined;
        if (!value) {
            player.send('Waypoint was not set properly.');
            player.def = undefined;
            return;
        }

        let dist = utilityVector.distance(player.pos, pos);
        let cost = dist * 0.03;

        if (player.getCash() < cost) {
            player.send(
                `{FF0000}Not enough money on hand for that distance. ${cost.toFixed(2) *
                    1}`
            );
            player.def = undefined;
            return;
        }

        let closestDriver = systemsJob.getClosestDriverByGuid(player, 'taxi');

        if (closestDriver === undefined) {
            player.send('No taxi driver is available at this time.');
            return;
        }

        if (!closestDriver.job.isAvailable) {
            player.send('No taxi driver is vailable at this time.');
            return;
        }

        // Set the driver to unavailable.
        closestDriver.job.isAvailable = false;

        // Send the player a message notifying them.
        player.send('{FFFF00}A taxi driver is now enroute.');
        player.send(
            `{FFFF00}You will be charged ${cost.toFixed(2) * 1} after this ride.`
        );

        // Process the callback for the driver.
        closestDriver.job.processTarget(player, {
            fare: cost.toFixed(2) * 1,
            position: pos
        });
    };

    // Send Callback
    player.setSyncedMeta('callback:Request', { name: callbackname, type: 'waypoint' });
});

/**
 * Used to cancel a taxi fare.
 */
chat.registerCmd('taxicancel', player => {
    systemsJob.cancelTarget(player);
});

// Called from the client-side when the player wants to
// start a taxi job; required to get a position of a waypoint.
// So the taxi driver knows where to go.
function callbackWaypoint(player, callbackname, value, pos) {
    alt.offClient(callbackname, callbackWaypoint);
    if (player.taxi === undefined) return;
    player.taxi(value, pos);
}
