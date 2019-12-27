import * as alt from 'alt';
import SQL from '../../postgres-wrapper/database.js'; // Database
import {
    Account,
    Character,
    Vehicle,
    Details,
    Door,
    Factions
} from './entities/entities.js'; // Schemas for Database
import { cacheAccount, setVehicleID, cacheCharacter } from './cache/cache.js';
import { Doors } from './configuration/doors.js';
import fs from 'fs';
import path from 'path';

const resourceDir = alt.getResourcePath('orp');
const dbData = fs
    .readFileSync(path.join(resourceDir, '/server/configuration/database.json'))
    .toString();
let dbInfo;
let isConnectionReady = false;

try {
    dbInfo = JSON.parse(dbData);
} catch (err) {
    console.log('FAILED TO PROCESS DATABASE INFO. RUN INSTALLATION PROCESS AGAIN.');
    console.log(err);
    process.exit(0);
}

// Setup Main Entities and Database Connection
let db = new SQL(
    dbInfo.type,
    dbInfo.address,
    dbInfo.port,
    dbInfo.username,
    dbInfo.password,
    dbInfo.dbname,
    // Specify New Table Schemas Here
    [Account, Character, Vehicle, Details, Door, Factions]
);

alt.on('ConnectionComplete', () => {
    if (isConnectionReady) {
        return;
    }

    isConnectionReady = true;
});

const startupInterval = setInterval(() => {
    alt.log('Checking if connection is ready...');
    if (isConnectionReady) {
        clearInterval(startupInterval);
        LoadFiles();
    }
}, 2000);

function LoadFiles() {
    let filesLoaded = 0;
    const folders = fs.readdirSync(path.join(alt.rootDir, '/resources/orp/server/'));
    const filterFolders = folders.filter(x => !x.includes('.js'));
    for (let i = 0; i < filterFolders.length; i++) {
        const folder = filterFolders[i];
        const files = fs.readdirSync(
            path.join(alt.rootDir, `/resources/orp/server/${folder}`)
        );
        const filterFiles = files.filter(x => x.includes('.js'));
        for (let f = 0; f < filterFiles.length; f++) {
            const newPath = `./${folder}/${filterFiles[f]}`;
            import(newPath)
                .catch(err => {
                    console.log('\r\n\x1b[31m[ERROR IN LOADED FILE]');
                    console.log(err);
                    alt.log(`\r\n --> File that couldn't load: ${newPath}`);
                    alt.log('\r\n\x1b[31mKilling process; failed to load a file. \r\n');
                    process.exit(1);
                })
                .then(loadedResult => {
                    if (loadedResult) {
                        filesLoaded += 1;
                        alt.log(`[${filesLoaded}] Loaded: ${newPath}`);
                    } else {
                        alt.log(`Failed to load: ${newPath}`);
                        alt.log('Killing process; failed to load a file.');
                        process.exit(1);
                    }
                });
        }
    }

    cacheInformation();
    setTimeout(() => {
        alt.log('\r\nORP Ready - Loading Any Addons\r\n');
        alt.emit('orp:Ready');
    }, 5000);
}

// Used to speed up the server dramatically.
async function cacheInformation() {
    // Fetch Last Vehicle ID
    const vehicleData = await db.fetchLastId('Vehicle');
    if (!vehicleData) {
        setVehicleID(0);
    } else {
        setVehicleID(vehicleData.id);
    }

    // Cache Accounts
    const accounts = await db.selectData('Account', ['id', 'userid', 'rank', 'email']);
    if (accounts) {
        for (let i = 0; i < accounts.length; i++) {
            cacheAccount(
                accounts[i].userid,
                accounts[i].id,
                accounts[i].rank,
                accounts[i].email
            );
        }

        alt.log(`=====> Cached: ${accounts.length} Accounts`);
    }

    // Cache Some Character Data
    const characters = await db.selectData('Character', ['id', 'name']);
    if (characters) {
        for (let i = 0; i < characters.length; i++) {
            cacheCharacter(characters[i].id, characters[i].name);
        }
    }

    // Cache Dynamic Doors
    // Only persists the dynamic values
    for (let i = 0; i < Doors.length; i++) {
        const doorData = await db.fetchByIds(Doors[i].id, 'Door');
        if (doorData) {
            alt.emit('door:CacheDoor', doorData[0].id, doorData[0]);
            continue;
        }

        // Create new door with defaults from configuration
        let door = {
            id: Doors[i].id,
            guid: Doors[i].guid,
            lockstate: Doors[i].lockstate,
            salePrice: Doors[i].salePrice
        };

        db.insertData(door, 'Door').then(newDoorData => {
            alt.emit('door:CacheDoor', door.id, newDoorData);
        });
    }

    alt.emit('cache:Complete');
}
