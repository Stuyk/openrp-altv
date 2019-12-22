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
            import(newPath).catch(err => {
                console.log('\r\n\x1b[31mERROR IN LOADED FILE');
                alt.log(`Failed to load: ${newPath}`);
                alt.log('Killing process; failed to load a file.');
                process.kill(-1);
                console.log('\r\n \x1b[0m');
                return undefined;
            }).then(loadedResult => {
                if (loadedResult) {
                    filesLoaded += 1;
                    alt.log(`[${filesLoaded}] Loaded: ${newPath}`);
                } else {
                    alt.log(`Failed to load: ${newPath}`);
                    alt.log('Killing process; failed to load a file.');
                    process.kill(-1);
                }
            })
        }
    }

    cacheInformation();
    setTimeout(() => {
        alt.log('\r\nORP Ready - Loading Any Addons\r\n');
        alt.emit('orp:Ready');
    }, 5000);
}

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
    db.selectData('Account', ['id', 'userid', 'rank'], data => {
        if (!data) return;

        for (let i = 0; i < data.length; i++) {
            cacheAccount(data[i].userid, data[i].id, data[i].rank);
        }

        alt.log(`=====> Cached: ${data.length} Accounts`);
    });

    db.selectData('Character', ['id', 'name'], data => {
        if (!data) return;

        for (let i = 0; i < data.length; i++) {
            cacheCharacter(data[i].id, data[i].name);
        }
    });

    // Cache dynamic doors
    // Only persists the dynamic values
    for (let i = 0; i < Doors.length; i++) {
        db.fetchByIds(Doors[i].id, 'Door', res => {
            if (res) {
                alt.emit('door:CacheDoor', res[0].id, res[0]);
            } else {
                // Create new door with defaults from configuration
                let door = {
                    id: Doors[i].id,
                    guid: Doors[i].guid,
                    lockstate: Doors[i].lockstate,
                    salePrice: Doors[i].salePrice
                };
                db.insertData(door, 'Door', res => {
                    alt.emit('door:CacheDoor', door.id, door);
                });
            }
        });
    }

    alt.emit('cache:Complete');
}
