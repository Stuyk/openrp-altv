import * as alt from 'alt';
import * as native from 'natives';
import {
    Atms,
    FuelStations,
    Hospitals,
    ToolBenches,
    CookingSources,
    FruitStands,
    BandSaws
} from '/client/locations/locations.js';

alt.log('Loaded: client->blips->bliphelper.js');

let sectorBlips = [];
let categories = {};

// Used to create blips for the player to see.
export function createBlip(category, pos, sprite, color, label, display = 2) {
    const blip = native.addBlipForCoord(pos.x, pos.y, pos.z);
    native.setBlipAsShortRange(blip, true);
    native.setBlipSprite(blip, sprite);
    native.setBlipColour(blip, color);
    native.beginTextCommandSetBlipName('STRING');
    native.addTextComponentSubstringPlayerName(label);
    native.endTextCommandSetBlipName(blip);
    native.setBlipDisplay(blip, display);

    if (category === 'temporary') {
        return blip;
    }

    const keys = Object.keys(categories);
    let index = keys.findIndex(key => key === category);
    if (index <= -1) {
        categories[category] = [blip];
    } else {
        categories[category].push(blip);
    }

    return blip;
}

export function setBlipCategoryState(name, state) {
    if (!categories[name]) return;
    categories[name].forEach(blip => {
        const toggleState = state ? 2 : 0;
        native.setBlipDisplay(blip, toggleState);
    });
}

// Used to create area blips for the player to see.
export function createAreaBlip(pos, width, length, color, alpha = 100) {
    const blip = new alt.AreaBlip(pos.x, pos.y, pos.z, width, length);
    blip.color = color;
    blip.alpha = alpha;
    blip.rotation = 0;
    return blip;
}

// Used to create sector blips, these are literally area blips but are also stored in a variable
export function createSectorBlip(sector) {
    let pos = {};
    pos.x = (sector.coords.first.x + sector.coords.second.x) / 2;
    pos.y = (sector.coords.first.y + sector.coords.second.y) / 2;
    pos.z = (sector.coords.first.z + sector.coords.second.z) / 2;

    const color = sector.color ? sector.color : 4;
    const blip = createAreaBlip(pos, sector.width, sector.length, parseInt(color));
    sectorBlips.push(blip);
    return blip;
}

// Destroys and removes all sector blips
export function cleanSectorBlips() {
    sectorBlips.forEach((_, index) => {
        sectorBlips[index].destroy();
        sectorBlips.splice(index, 1);
    });
}

alt.onServer('grid:TempTurfs', sectors => {
    const turfBlips = [];
    sectors.forEach(sector => {
        alt.log('turf');

        const pos = {
            x: (sector.coords.first.x + sector.coords.second.x) / 2,
            y: (sector.coords.first.y + sector.coords.second.y) / 2,
            z: (sector.coords.first.z + sector.coords.second.z) / 2
        };

        const color = sector.color ? sector.color : 4;
        // category, pos, sprite, color, label, display = 2

        const blip = native.addBlipForArea(
            pos.x,
            pos.y,
            pos.z,
            sector.width,
            sector.length
        );
        native.setBlipColour(blip, color);
        native.setBlipAlpha(blip, 100);
        native.setBlipRotation(blip, 0);
        turfBlips.push(blip);
    });

    alt.setTimeout(() => {
        turfBlips.forEach(turf => {
            native.removeBlip(turf);
        });
    }, 60000);
});

// Load ATM Blips
Atms.forEach(atm => {
    createBlip('atm', atm, 277, 53, 'ATM', 5);
});

FuelStations.forEach(station => {
    createBlip('fuel', station, 361, 53, 'Fuel Station');
});

Hospitals.forEach(hospital => {
    createBlip('hospital', hospital, 153, 43, 'Hospital');
});

FruitStands.forEach(stand => {
    createBlip('foodstand', stand, 478, 53, 'Food Stand', 5);
});

ToolBenches.forEach(bench => {
    createBlip('toolbench', bench, 643, 53, 'Tool Bench', 5);
});

CookingSources.forEach(source => {
    createBlip('cookingsource', source, 648, 53, 'Cooking Source', 5);
});

BandSaws.forEach(saw => {
    createBlip('bandsaw', saw, 656, 53, 'Bandsaw', 5);
});

//  alt.emit('option:Changed', option, cache.get(`option:${option}`));

alt.on('option:Changed', (optionName, value) => {
    alt.log(optionName);

    const keys = Object.keys(categories);
    if (!keys.includes(optionName.replace('option:', ''))) return;
    setBlipCategoryState(optionName.replace('option:', ''), value);
});
