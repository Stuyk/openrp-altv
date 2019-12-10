import * as alt from 'alt';
import * as chat from '../chat/chat.js';
import { distance, getClosestPlayer } from '../utility/vector.js';

/**
 * Find a player with the guid of 'taxi'
 * Request a waypoint from clientside.
 * Fulfill the rest.
 */
chat.registerCmd('taxi', player => {
    if (player.data === undefined) return;
    if (player.jobber) return;
    if (player.job) {
        player.send('You cannot call a taxi while on the job');
        return;
    }

    // Setup the Callback
    let callbackname = `${player.name}:Waypoint`;
    alt.onClient(callbackname, callbackWaypoint);
    player.send('Requesting taxi...');

    // Setup Promise
    player.taxi = (value, pos) => {
        player.taxi = undefined;
        if (!value) {
            player.send('Waypoint was not set properly.');
            player.def = undefined;
            return;
        }

        let dist = distance(player.pos, pos);
        let cost = dist * 0.03;

        if (player.getCash() < cost) {
            player.send(
                `{FF0000}Not enough money on hand for that distance. ${cost.toFixed(2) *
                    1}`
            );
            player.def = undefined;
            return;
        }

        let taxiDrivers = alt.Player.all.filter(
            x => x.job !== undefined && x.job.name === 'Taxi Depot'
        );

        if (taxiDrivers.length <= 0) {
            player.send('No taxi driver is available at this time.');
            return;
        }

        let closestDriver = getClosestPlayer(player, taxiDrivers, true);
        if (closestDriver === undefined) {
            player.send('No taxi driver is available at this time.');
            return;
        }

        closestDriver.job.setTarget(
            closestDriver,
            player,
            pos,
            'Take the target to their destination.',
            player
        );

        // Send the player a message notifying them.
        closestDriver.send('A customer is waiting to be picked up...');
        player.send('{FFFF00}A taxi driver is now enroute.');
        player.send(
            `{FFFF00}You will be charged ${cost.toFixed(2) * 1} after this ride.`
        );
        player.send('{FFFF00}Stay in your current position to be picked up.');
        player.jobber = {
            fare: cost.toFixed(2) * 1,
            position: player.pos,
            employee: closestDriver
        };
    };

    // Send Callback
    player.setSyncedMeta('callback:Request', { name: callbackname, type: 'waypoint' });
});

// Called from the client-side when the player wants to
// start a taxi job; required to get a position of a waypoint.
// So the taxi driver knows where to go.
function callbackWaypoint(player, callbackname, value, pos) {
    alt.offClient(callbackname, callbackWaypoint);
    if (player.taxi === undefined) return;
    player.taxi(value, pos);
}
