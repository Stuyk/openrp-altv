import * as alt from 'alt';
import * as chat from 'chat';
import SQL from '../../postgres-wrapper/database.mjs'; // Database
import { Account, Character } from './entities/entities.mjs'; // Schemas for Database
import * as configurationDatabase from './configuration/database.mjs'; // Database Configuration
import * as systemsInteraction from './systems/interaction.mjs';

// Setup Main Entities and Database Connection
new SQL(
    configurationDatabase.DatabaseInfo.type,
    configurationDatabase.DatabaseInfo.address,
    configurationDatabase.DatabaseInfo.port,
    configurationDatabase.DatabaseInfo.username,
    configurationDatabase.DatabaseInfo.password,
    configurationDatabase.DatabaseInfo.dbname,
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
    import('./events/playerDeath.mjs');
    import('./events/entityEnterColshape.mjs');
    import('./events/entityLeaveColshape.mjs');

    // Custom Client Events / Custom Server Events
    import('./serverEvents/events.mjs');
    import('./clientEvents/events.mjs');

    // Interactions
    import('./interactions/atms.mjs');

    // Sandbox Commands
    import('./commands/sandbox.mjs');
    import('./commands/revive.mjs');

    // Systems
    import('./systems/inventory.mjs');
    import('./systems/time.mjs');

    // Import Item Effects
    import('./itemeffects/consume.mjs');
    import('./itemeffects/showlicense.mjs');
});
