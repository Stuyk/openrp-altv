import * as alt from 'alt';
import * as chat from 'chat';
import SQL from '../../postgres-wrapper/database.mjs'; // Database
import { Account, Character } from './entities/entities.mjs'; // Schemas for Database
import * as DBConf from './configuration/database.mjs'; // Database Configuration
import * as interactionsys from './systems/interactionsystem.mjs';

// Setup Main Entities and Database Connection
new SQL(
    DBConf.DatabaseInfo.type,
    DBConf.DatabaseInfo.address,
    DBConf.DatabaseInfo.port,
    DBConf.DatabaseInfo.username,
    DBConf.DatabaseInfo.password,
    DBConf.DatabaseInfo.dbname,
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
    import('./events/entityEnterColshape.mjs');
    import('./events/entityLeaveColshape.mjs');

    // Custom Client Events / Custom Server Events
    import('./serverEvents/serverEventRouting.mjs');
    import('./clientEvents/clientEventRouting.mjs');

    // Interactions
    import('./interactions/atms.mjs');

    // Sandbox Commands
    import('./commands/sandbox.mjs');
});
