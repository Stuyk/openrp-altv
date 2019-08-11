import * as alt from 'alt';
import SQL from '../../postgres-wrapper/database.mjs';
import { Account, Character } from './entities/entities.mjs';
import * as chat from 'chat';

// Setup Main Entities and Database Connection
new SQL('postgresql://postgres:abc123@localhost:5432/altv', [
    Account,
    Character
]);

// From Database; load rest of modules that use database connection.
alt.on('ConnectionComplete', () => {
    // All additional will be imported here.
    import('./registration/registration.mjs');
    import('./events/onPlayerLoggedIn.mjs');
    import('./events/onPlayerLogout.mjs');
    import('./events/onClientEvents.mjs');
    import('./events/onPlayerJoin.mjs');
});

chat.registerCmd('pos', player => {
    console.log(player.pos);
});

chat.registerCmd('veh', (player, arg) => {
    new alt.Vehicle('T20', player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
});

chat.registerCmd('tpw', player => {
    alt.emitClient(player, 'tpw');
});

alt.onClient('tpToWaypoint', (player, coords) => {
    player.pos = coords;
});

chat.registerCmd('tpcoord', (player, arg) => {
    player.pos = { x: arg[0], y: arg[1], z: arg[2] };
});
