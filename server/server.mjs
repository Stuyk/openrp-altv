import * as alt from 'alt';
import * as chat from 'chat';

// Import Database
import SQL from '../../postgres-wrapper/database.mjs';

// Used for Table Schemas
import { Account, Character } from './entities/entities.mjs';

// Used for Database Info
import * as DBConf from './configuration/database.mjs';

// Licensing
import * as TermsAndConditions from '../terms-and-conditions.mjs';

console.log('\r\n');
TermsAndConditions.data.terms.forEach(line => {
    console.log(line);
});
console.log('\r\n');

if (!TermsAndConditions.data.do_you_agree) {
    console.log(
        'Please read the terms and conditions and modify "terms-and-conditions.mjs"'
    );
    console.log('You do not agree to the terms and conditions. Goodbye.');
    console.log('\r\n');
} else {
    console.log('License agreement accepted. Moving on.');
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
}
