import * as alt from 'alt';
import * as chat from 'chat';
import SQL from '../../postgres-wrapper/database.mjs';

// Used for Table Schemas
import { Account, Character } from './entities/entities.mjs';

// Used for Database Info
import * as DBConf from './configuration/database.mjs';

// Setup Main Entities and Database Connection
new SQL(
    `postgresql://${DBConf.DatabaseInfo.username}:${
        DBConf.DatabaseInfo.password
    }@${DBConf.DatabaseInfo.address}:${DBConf.DatabaseInfo.port}/${
        DBConf.DatabaseInfo.dbname
    }`,
    // Specify New Table Schemas Here
    [Account, Character]
);

// After Database Connection is complete. Load the rest of the modules.
// This is required so we don't use the Database functionality too early.
// Please keep that in mind if you plan on expanding this framework.
alt.on('ConnectionComplete', () => {
    // Standard Events
    import('./events/playerConnect.mjs');
    import('./events/playerDisconnect.mjs');
    // Custom Client Events / Custom Server Events
    import('./serverEvents/serverEventRouting.mjs');
    import('./clientEvents/clientEventRouting.mjs');
});

/*
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
*/
