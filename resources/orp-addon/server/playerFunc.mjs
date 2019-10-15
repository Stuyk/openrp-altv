import * as alt from 'alt';

/*
    Example of how to use the `send` function from inside of ORP.
    Set the arrest time of a player.
    Eject them from a vehicle.

    Check: orp/server/utility/player.mjs
*/

/*
alt.Player.all.forEach(player => {
    alt.emit(`orp:PlayerFunc`, player, 'send', 'hello world');
    alt.emit(`orp:PlayerFunc`, player, 'setArrestTime', 60000);

    if (player.vehicle) {
        alt.emit(`orp:PlayerFunc`, player, 'eject');
    }
});
*/
