import * as alt from 'alt';
import SQL from '../../postgres-wrapper/database.mjs';
import { Account, Character } from './entities/entities.mjs';

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
});
