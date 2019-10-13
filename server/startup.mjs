import * as alt from 'alt';
//import * as chat from 'chat';
import SQL from '../../postgres-wrapper/database.mjs'; // Database
import { Account, Character, Vehicle, Details } from './entities/entities.mjs'; // Schemas for Database
import * as configurationDatabase from './configuration/database.mjs'; // Database Configuration
import { cacheAccount, setVehicleID } from './cache/cache.mjs';

// Setup Main Entities and Database Connection
let db = new SQL(
    configurationDatabase.DatabaseInfo.type,
    configurationDatabase.DatabaseInfo.address,
    configurationDatabase.DatabaseInfo.port,
    configurationDatabase.DatabaseInfo.username,
    configurationDatabase.DatabaseInfo.password,
    configurationDatabase.DatabaseInfo.dbname,
    // Specify New Table Schemas Here
    [Account, Character, Vehicle, Details]
);

// After Database Connection is complete. Load the rest of the modules.
// This is required so we don't use the Database functionality too early.
// Please keep that in mind if you plan on expanding this framework.
alt.on('ConnectionComplete', () => {
    // Standard Events
    import('./events/playerConnect.mjs');
    import('./events/playerDisconnect.mjs');
    import('./events/playerDeath.mjs');
    import('./events/consoleCommand.mjs');
    import('./events/entityEnterColshape.mjs');
    import('./events/entityLeaveColshape.mjs');
    import('./events/playerLeftVehicle.mjs');
    import('./events/playerEnteredVehicle.mjs');
    import('./events/explosion.mjs');
    import('./events/weaponDamage.mjs');

    // Custom Client Events / Custom Server Events
    import('./clientEvents/events.mjs');
    import('./clientEvents/useEvents.mjs');

    // Intervals
    import('./intervals/players.mjs');

    // Sandbox Commands
    import('./commands/job.mjs');
    import('./commands/sandbox.mjs');
    import('./commands/revive.mjs');
    import('./commands/roleplay.mjs');
    import('./commands/taxi.mjs');
    import('./commands/mechanic.mjs');
    import('./commands/phone.mjs');
    import('./commands/mdc.mjs');

    // Systems
    import('./systems/anticheat.mjs');
    import('./systems/vehicles.mjs');
    import('./systems/inventory.mjs');
    import('./systems/time.mjs');
    import('./systems/job.mjs');
    import('./systems/use.mjs');
    import('./systems/xp.mjs');
    import('./systems/grid.mjs');

    // Jobs
    import('./jobs/fishing.mjs');
    import('./jobs/agilityTrack.mjs');
    import('./jobs/agilityWorkout.mjs');
    import('./jobs/agilityMtnBike1.mjs');
    import('./jobs/agilityMtnBike2.mjs');
    import('./jobs/agilityDirtbike.mjs');
    import('./jobs/agilityDirtbike2.mjs');
    import('./jobs/agilityWaterScooter.mjs');
    import('./jobs/agilityDirtBuggy.mjs');
    import('./jobs/gatheringKevlarium1.mjs');
    import('./jobs/gatheringVigorium1.mjs');
    import('./jobs/miningQuarry.mjs');
    import('./jobs/miningShaft.mjs');
    import('./jobs/playerTaxi.mjs');
    import('./jobs/playerMechanic.mjs');
    import('./jobs/officer.mjs');
    import('./jobs/refineKevlarium.mjs');
    import('./jobs/refineVigorium.mjs');
    import('./jobs/smithingRefinery.mjs');
    import('./jobs/woodcuttingLumber.mjs');
    import('./jobs/woodcuttingRefinery.mjs');
    import('./jobs/drivingSchool.mjs');
    import('./jobs/mountainThruster.mjs');
    
    // Import Item Effects
    import('./itemeffects/consume.mjs');
    import('./itemeffects/showlicense.mjs');
    import('./itemeffects/equipitem.mjs');

    cacheInformation();
});

// Used to speed up the server dramatically.
function cacheInformation() {
    db.fetchLastId('Vehicle', res => {
        if (!res) {
            setVehicleID(0);
        } else {
            setVehicleID(res.id);
        }
    });

    // Passwords are encrypted.
    db.selectData('Account', ['id', 'username', 'password'], data => {
        if (data === undefined) return;

        for (let i = 0; i < data.length; i++) {
            cacheAccount(data[i].username, data[i].id, data[i].password);
        }

        console.log(`=====> Cached: ${data.length} Accounts`);
    });
}
