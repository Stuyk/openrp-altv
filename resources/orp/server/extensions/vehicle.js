import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.js';
import { distance } from '../utility/vector.js';
import { Config } from '../configuration/config.js';

// Load the database handler.
const db = new SQL();

const notVehicles = [
    'bmx',
    'cruiser',
    'fixter',
    'scorcher',
    'tribike',
    'tribike2',
    'tribike3'
];

alt.Vehicle.prototype.startTick = function startTick() {
    alt.emit('parse:Vehicle', this);
};

alt.Vehicle.prototype.save = async function save() {
    if (this.noSave) {
        return;
    }

    if (!this.markedForSave) {
        return;
    }

    if (this.markedForSave.length <= 0) {
        return;
    }

    const dataToSave = {};
    this.markedForSave.forEach(fieldName => {
        dataToSave[fieldName] = this.data[fieldName];
    });

    this.markedForSave = [];
    await db.updatePartialData(this.data.id, dataToSave, 'Vehicle');
};

alt.Vehicle.prototype.saveField = async function saveField(id, fieldName, fieldValue) {
    if (this.noSave) {
        return;
    }

    await db.updatePartialData(id, { [fieldName]: fieldValue }, 'Vehicle');
};

alt.Vehicle.prototype.updateField = function updateField(fieldName, fieldValue) {
    if (this.noSave) {
        return;
    }

    if (fieldName !== 'stats' && fieldName !== 'fuel') {
        if (!this.data[fieldName]) {
            alt.log(`That field does not exist for vehicle. ${fieldName}`);
            return;
        }
    }

    this.data[fieldName] = fieldValue;

    if (!this.markedForSave) {
        this.markedForSave = [];
    }

    if (this.markedForSave.includes(fieldName)) {
        return;
    }

    this.markedForSave.push(fieldName);
};

alt.Vehicle.prototype.saveVehicleData = function saveVehicleData() {
    if (this.noSave) {
        return;
    }

    this.updateField('position', JSON.stringify(this.pos));
    this.updateField('rotation', JSON.stringify(this.rot));
    this.updateField('fuel', this.fuel);
    this.updateField(
        'stats',
        JSON.stringify({
            bodyHealth: this.bodyHealth,
            engineHealth: this.engineHealth,
            lockState: this.lockState
        })
    );
    this.save();
};

alt.Vehicle.prototype.getInventory = function getInventory() {
    if (this.noSave) {
        return;
    }

    return JSON.parse(this.data.inventory);
};

alt.Vehicle.prototype.subItemByHash = function subItemByHash(hash) {
    if (this.noSave) {
        return;
    }

    const inventory = JSON.parse(this.data.inventory);
    const index = inventory.findIndex(item => item && item.hash === hash);

    if (index <= -1) {
        return false;
    }

    inventory.splice(index, 1);
    this.data.inventory = JSON.stringify(inventory);
    this.saveField(this.data.id, 'inventory', this.data.inventory);
    return true;
};

alt.Vehicle.prototype.getSlots = function getSlots() {
    const inventory = JSON.parse(this.data.inventory);

    if (inventory === undefined) {
        return 27;
    }

    return inventory.length;
};

alt.Vehicle.prototype.addItem = function addItem(itemClone) {
    const inventory = JSON.parse(this.data.inventory);

    if (inventory.length >= 27) {
        return false;
    }

    inventory.push(itemClone);
    this.data.inventory = JSON.stringify(inventory);
    this.saveField(this.data.id, 'inventory', this.data.inventory);
    return true;
};

alt.Vehicle.prototype.saveRotation = function saveRotation() {
    if (this.noSave) {
        return;
    }

    this.updateField('rotation', JSON.stringify(this.rot));
};

alt.Vehicle.prototype.savePosition = function savePosition() {
    if (this.noSave) {
        return;
    }

    this.updateField('position', JSON.stringify(this.pos));
};

alt.Vehicle.prototype.despawnVehicle = function despawnVehicle() {
    if (!this.noSave) {
        this.saveVehicleData();
        this.save();
    }

    this.destroy();
};

alt.Vehicle.prototype.saveCustom = function saveCustom(json) {
    if (this.noSave) {
        return;
    }

    this.data.customization = json;
    this.saveField(this.data.id, 'customization', this.data.customization);

    this.syncCustom();
};

alt.Vehicle.prototype.sync = function sync() {
    if (!this.data.stats) {
        this.data.stats = '{"bodyHealth":1000,"engineHealth":0,"lockState":1}';
        this.updateField('stats', this.data.stats);
    }

    if (!this.data.customization) {
        this.data.customization = '{}';
        this.updateField('customization', this.data.customization);
    }

    if (!this.data.inventory) {
        this.data.inventory = '[]';
        this.updateField('inventory', this.data.inventory);
    }
};

alt.Vehicle.prototype.syncCustom = function syncCustom() {
    if (this.noSave) {
        return;
    }

    if (!this.data) {
        return;
    }

    if (!this.data.customization) {
        return;
    }

    const mods = JSON.parse(this.data.customization);
    Object.keys(mods).forEach(key => {
        if (key !== 'colors' && this.modKitsCount > 0) {
            this.modKit = 1;
            let index = parseInt(key);
            let value = parseInt(mods[key]) + 1;

            if (index !== 23) {
                try {
                    this.setMod(index, value);
                } catch (e) {
                    console.log(`Mod: ${index} could not be applied with value ${value}`);
                }
            } else {
                this.setSyncedMeta('vehicleWheels', value);
            }
            return;
        }

        if (key === 'colors') {
            if (mods[key].primary) {
                this.setSyncedMeta('primaryPaint', mods[key].primary.type);
                this.setSyncedMeta('primaryColor', mods[key].primary.color);
            }

            if (mods[key].secondary) {
                this.setSyncedMeta('secondaryPaint', mods[key].secondary.type);
                this.setSyncedMeta('secondaryColor', mods[key].secondary.color);
            }
            return;
        }
    });
};

alt.Vehicle.prototype.saveDimension = function saveDimension(number) {
    this.data.dimension = number;
    this.saveField(this.data.id, 'dimension', number);
};

alt.Vehicle.prototype.honkHorn = function honkHorn(times, duration) {
    alt.emitClient(null, 'vehicle:HonkHorn', this, times, duration);
};

alt.Vehicle.prototype.repair = async function repair() {
    const pos = { ...this.pos };
    const rot = { ...this.rot };
    const data = { ...this.data };

    rot.x = 0;
    rot.y = 0;

    try {
        this.destroy();
    } catch (err) {}

    data.position = JSON.stringify(pos);
    data.rotation = JSON.stringify(rot);
    data.stats = JSON.stringify({
        bodyHealth: 1000,
        engineHealth: 1000,
        lockState: data.lockState
    });

    await db.updatePartialData(
        data.id,
        { position: data.position, rotation: data.rotation, stats: data.stats },
        'Vehicle'
    );

    if (!this.owner) {
        return;
    }

    const index = this.owner.vehicles.findIndex(vehicle => vehicle === this);
    if (index != -1) {
        this.owner.vehicles.splice(index, 1);
    }

    alt.emit('vehicle:Respawn', this.owner, data);
};

alt.Vehicle.prototype.toggleDoor = function toggleDoor(player, id, closeAll = false) {
    if (this.doorStates === undefined) {
        this.doorStates = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false
        };
    }

    // Toggle
    this.doorStates[id] = closeAll ? false : !this.doorStates[id];
    alt.emitClient(player, 'vehicle:ToggleDoor', this, id, this.doorStates[id]);
};

alt.Vehicle.prototype.syncFuel = function syncFuel() {
    const included = notVehicles.find(veh => {
        const hash = alt.hash(veh);
        if (hash === this.model) {
            return veh;
        }
    });

    if (included) {
        return;
    }

    const currentFuel = this.fuel;

    if (!this.lastPosition) {
        this.lastPosition = this.pos;
    }

    const dist = distance(this.pos, this.lastPosition);
    if (dist > 10 && this.driver) {
        const fuelConsumed = dist / Config.vehicleBaseFuel;
        const remainingFuel = currentFuel - fuelConsumed;
        this.lastPosition = this.pos;
        this.fuel = remainingFuel <= 0 ? 0 : remainingFuel;

        if (this.fuel <= 0 && this.isEngineOn) {
            this.isEngineOn = false;
            alt.emitClient(null, 'vehicle:KillEngine', this);
            if (this.driver) {
                alt.emitClient(this.driver, 'vehicle:StartEngine', false);
                this.driver.send(`{FFFF00} You are out of fuel.`);
            }
        }
    }

    this.setSyncedMeta('fuel', this.fuel);
    this.setSyncedMeta('basefuel', Config.vehicleBaseFuel);
};

alt.Vehicle.prototype.fillFuel = function fillFuel() {
    this.fuel = Config.vehicleBaseFuel;
    this.setSyncedMeta('fuel', this.fuel);
    if (this.data) {
        this.saveField(this.data.id, 'fuel', this.fuel);
    }
};
