/* eslint-disable no-undef */
import * as alt from 'alt';
import { generateHash } from '../utility/encryption.js';
import { Items, BaseItems } from '../configuration/items.js';
import { Config } from '../configuration/config.js';
import { objectToNull } from '../utility/object.js';
import { spawnVehicle } from '../systems/vehicles.js';
import { quitJob } from '../systems/job.js';
import { fetchNextVehicleID, getCharacterName, modifyRank } from '../cache/cache.js';
import { dropNewItem } from '../systems/inventory.js';
import { doorStates } from '../systems/use.js';
import { getLevel } from '../systems/xp.js';

import * as systemsInteraction from '../systems/interaction.js';
import * as systemsTime from '../systems/time.js';

import SQL from '../../../postgres-wrapper/database.js';

// Load the database handler.
const db = new SQL();

/**
 *  Used to emit meta to the local player and server.
 *  Can be fetched on the client side by doing getMeta.
 * @memberof player
 * @param {any} key
 * @param {any} value
 */
alt.Player.prototype.emitMeta = function emitMeta(key, value) {
    this.setMeta(key, value);
    alt.emitClient(this, 'meta:Emit', key, value);
};

/**
 *  Used to save all `this.data` information.
 * @memberof player
 */
alt.Player.prototype.save = function save() {
    db.upsertData(this.data, 'Character', () => {});
};

/**
 *  Used to save a specific id, field, and value.
 * @memberof player
 * @param {string/number} id User's database id. ie. this.data.id
 * @param {string} fieldName The field name to use.
 * @param {any} fieldValue The field value to apply.
 */
alt.Player.prototype.saveField = function saveField(id, fieldName, fieldValue) {
    db.updatePartialData(id, { [fieldName]: fieldValue }, 'Character', () => {});
};

alt.Player.prototype.setRank = function setRank(flag) {
    this.rank = flag;
    modifyRank(this.pgid, flag);
    db.updatePartialData(this.accountID, { rank: flag }, 'Account', () => {
        alt.log(`Updated ${this.pgid} to rank ${flag}`);
    });
};

/**
 * Updates the player's current playing time.
 * Calculated from start time; until now. Then resets it.
 * @memberof player
 */
alt.Player.prototype.addRewardPoint = function addRewardPoint() {
    this.data.rewardpoints += 1;
    this.data.totalrewardpoints += 1;

    this.saveField(this.data.id, 'rewardpoints', this.data.rewardpoints);
    this.saveField(this.data.id, 'totalrewardpoints', this.data.totalrewardpoints);
    this.syncRewardPoints();
};

alt.Player.prototype.removeRewardPoints = function removeRewardPoints(amount) {
    if (isNaN(amount)) {
        return false;
    }

    if (amount <= -1) {
        return false;
    }

    if (this.data.rewardpoints - amount <= -1) {
        return false;
    }

    this.data.rewardpoints -= amount;
    this.saveField(this.data.id, 'rewardpoints', this.data.rewardpoints);
    this.syncRewardPoints();
    return true;
};

/**
 * Returns the reward points a player has.
 * @memberof player
 * @returns int
 */
alt.Player.prototype.getRewardPoints = function getRewardPoints() {
    return parseInt(this.data.rewardpoints);
};

/**
 * Returns the total reward points issued to a user.
 * @returns int
 */
alt.Player.prototype.getTotalRewardPoints = function getTotalRewardPoints() {
    return parseInt(this.data.totalrewardpoints);
};

alt.Player.prototype.syncRewardPoints = function syncRewardPoints() {
    this.emitMeta('reward:Available', parseInt(this.data.rewardpoints));
    this.emitMeta('reward:Total', parseInt(this.data.totalrewardpoints));
    this.emitMeta('reward:PerPoint', Config.defaultPlayerPaycheck);
};

alt.Player.prototype.getTotalPlayTime = function getTotalPlayTime() {
    const totalPoints = this.getTotalRewardPoints();
    const timePerPoint = Config.timeRewardTime;
    const timeInMS = totalPoints * timePerPoint;
    return timeInMS / 1000 / 60 / 60;
};

alt.Player.prototype.setLastLogin = function setLastLogin() {
    const date = new Date(this.data.lastlogin * 1).toString();
    this.send(`{FFFF00}Last Login: ${date}`);
    this.data.lastlogin = Date.now();
    this.saveField(this.data.id, 'lastlogin', this.data.lastlogin);
};

/**
 *  Send a message to the this.
 * @memberof player
 * @param {string} msg The message to send to the user.
 */
alt.Player.prototype.send = function send(msg) {
    alt.emitClient(this, 'chat:Send', msg);
};

/**
 *  Display a message in the center screen to the user.
 * @memberof player
 * @param {string} msg The message to send to the user.
 */
alt.Player.prototype.notice = function notice(msg) {
    this.emitMeta('hudNotice', msg);
};

/**
 *  Display a notification on the right-hand side.
 * @memberof player
 * @param {string} msg The message to send to the user.
 */
alt.Player.prototype.notify = function notify(msg) {
    this.emitMeta('queueNotification', msg);
};

alt.Player.prototype.saveDimension = function saveDimension(doorID) {
    this.dimension = doorID;
    this.data.dimension = doorID;
    this.saveField(this.data.id, 'dimension', doorID);
};

// ====================================
// Weather & Time
alt.Player.prototype.updateTime = function updateTime() {
    systemsTime.updatePlayerTime(this);
};

/**
 *  Save the user's location.
 * @memberof player
 * @param {Vector3} pos A vector3 object.
 */
alt.Player.prototype.saveLocation = function saveLocation(pos) {
    this.data.lastposition = pos;
    this.saveField(this.data.id, 'lastposition', JSON.stringify(pos));
};

/**
 *  Save the player's dead state.
 * @memberof player
 * @param {bool} value isPlayerDead?
 */
alt.Player.prototype.saveDead = function saveDead(value) {
    this.data.dead = value;

    if (!value) {
        this.saveField(this.data.id, 'health', 200);
        this.saveField(this.data.id, 'armour', 0);
    }

    this.saveField(this.data.id, 'dead', value);
};

/**
 *  Save Common Data; health, armour, position.
 * @memberof player
 */
alt.Player.prototype.saveData = function saveData() {
    this.data.health = this.health;
    this.data.armour = this.armour;
    this.data.lastposition = JSON.stringify(this.pos);
    this.save();
};

/**
 *  Synchronize interaction blips for the interaction system.
 * @memberof player
 */
alt.Player.prototype.syncInteractionBlips = function syncInteractionBlips() {
    systemsInteraction.syncBlips(this);
};

/**
 *  Remove pedestrian blood.
 * @memberof player
 */
alt.Player.prototype.clearBlood = function clearBlood() {
    alt.emitClient(this, 'respawn:ClearPedBloodDamage');
};

/**
 *  Fade the screen in and out over a period of time.
 * @memberof player
 * @param {number} fadeInOutMS Fade out for how long.
 * @param {number} timeoutMS Fade in after this time.
 */
alt.Player.prototype.screenFadeOutFadeIn = function screenFadeOutFadeIn(
    fadeInOutMS,
    timeoutMS
) {
    alt.emitClient(this, 'screen:FadeOutFadeIn', fadeInOutMS, timeoutMS);
};

/**
 *  Fade the screen out.
 * @memberof player
 * @param {number} timeInMS How long to fade the screen out for.
 */
alt.Player.prototype.screenFadeOut = function screenFadeOut(timeInMS) {
    alt.emitClient(this, 'screen:FadeOut', timeInMS);
};

/**
 *  Fade the screen in.
 * @memberof player
 * @param {number} timeInMS How long to fade the screen in.
 */
alt.Player.prototype.screenFadeIn = function screenFadeIn(timeInMS) {
    alt.emitClient(this, 'screen:FadeIn', timeInMS);
};

/**
 *  Blur the screen.
 * @memberof player
 * @param {number} timeInMS How long it takes to blur the screen.
 */
alt.Player.prototype.screenBlurOut = function screenBlurOut(timeInMS) {
    alt.emitClient(this, 'screen:BlurOut', timeInMS);
};

/**
 *  Unblur the screen.
 * @memberof player
 * @param {number} timeInMS How long to unblur the screen.
 */
alt.Player.prototype.screenBlurIn = function screenBlurIn(timeInMS) {
    alt.emitClient(this, 'screen:BlurIn', timeInMS);
};

/**
 *  Revive the this.
 * @memberof player
 */
alt.Player.prototype.revive = function revive() {
    this.screenFadeOutFadeIn(1000, 5000);

    if (!this.revivePos) {
        this.spawn(this.pos.x, this.pos.y, this.pos.z, 2000);
    } else {
        this.spawn(this.revivePos.x, this.revivePos.y, this.revivePos.z, 2000);
    }

    this.clearBlood();
    this.setHealth(200);
    this.setArmour(0);
    this.hasDied = false;
    this.revivePos = undefined;
    this.reviveTime = undefined;
    this.reviving = false;
    this.isArrested = false;
    this.lastLocation = undefined;
    this.sendToJail = false;
    this.saveDead(false);
    this.taxIncome(Config.hospitalPctFee, true, 'Hospital Fee');
    this.send('You have been revived.');
    this.setSyncedMeta('dead', false);
};

/**
 * Set the user's health.
 * @memberof player
 * @param {number} amount The amount to set the user's health.
 */
alt.Player.prototype.setHealth = function setHealth(amount) {
    this.health = amount;
    this.data.health = amount;
    this.lastHealth = this.health;
};

/**
 *  Set the user's armour.
 * @memberof player
 * @param {number} amount The amount to set the user's armour.
 */
alt.Player.prototype.setArmour = function setArmour(amount) {
    this.armour = amount;
    this.data.armour = amount;
    this.lastArmour = this.armour;
};

// ====================================
// Face Customizer
alt.Player.prototype.showFaceCustomizerDialogue = function showFaceCustomizerDialogue(
    location
) {
    if (location !== undefined) {
        this.lastLocation = location;
    } else {
        this.lastLocation = this.pos;
    }

    this.dimension = parseInt(this.data.id);
    alt.emitClient(this, 'face:ShowDialogue');
};

alt.Player.prototype.applyFace = function applyFace() {
    if (!this.data.sexgroup) {
        return;
    }

    const sexGroup = JSON.parse(this.data.sexgroup);
    if (sexGroup[0].value === 0) {
        this.model = 'mp_f_freemode_01';
    } else {
        this.model = 'mp_m_freemode_01';
    }

    Object.keys(this.data).forEach(key => {
        if (!key.includes('group')) return;
        this.emitMeta(key, this.data[key]);
    });
};

// ====================================
// Roleplay Name Dialogues
alt.Player.prototype.showRoleplayInfoDialogue = function showRoleplayInfoDialogue() {
    alt.emitClient(this, 'roleplayinfo:ShowDialogue');
};

alt.Player.prototype.closeRoleplayInfoDialogue = function closeRoleplayInfoDialogue() {
    alt.emitClient(this, 'roleplayinfo:CloseDialogue');
};

// ====================================
// Money Functions
// Remove cash from the this.
alt.Player.prototype.syncMoney = function syncMoney() {
    this.emitMeta('cash', this.data.cash);
};

alt.Player.prototype.subCash = function subCash(value) {
    let absValue = Math.abs(parseFloat(value)) * 1;

    if (this.data.cash < absValue) return false;

    this.data.cash -= absValue;
    this.data.cash = Number.parseFloat(this.data.cash).toFixed(2) * 1;
    this.saveField(this.data.id, 'cash', this.data.cash);
    this.syncMoney();
    return true;
};

// Add cash to the this.
alt.Player.prototype.addCash = function addCash(value) {
    let absValue = Math.abs(parseFloat(value));

    if (this.data.cash + absValue > 92233720368547758.07) {
        absValue = 0;
    }

    this.data.cash += absValue;
    this.data.cash = Number.parseFloat(this.data.cash).toFixed(2) * 1;
    this.saveField(this.data.id, 'cash', this.data.cash);
    this.syncMoney();
    return true;
};

// Get the player's cash balance.
alt.Player.prototype.getCash = function getCash() {
    return this.data.cash;
};

alt.Player.prototype.subToZero = function subToZero(amount) {
    this.data.cash -= amount;
    if (this.data.cash < 0) {
        this.data.cash = 0;
    }

    this.saveField(this.data.id, 'cash', this.data.cash);
    this.syncMoney();
};

alt.Player.prototype.taxIncome = function taxIncome(percentage, useHighest, reason) {
    const cash = player.data.cash;
    let cashTaxAmount = cash * percentage;
    this.subToZero(cashTaxAmount);
    this.send(`You were taxed: $${cashTaxAmount.toFixed(2) * 1}`);
    this.send(`Reason: ${reason}`);
};

// ====================================
// Load Blip for client.
alt.Player.prototype.createBlip = function createBlip(
    category,
    pos,
    sprite,
    colour,
    label
) {
    alt.emitClient(this, 'blip:CreateBlip', category, pos, sprite, colour, label);
};

// ====================================
// Show the ATM Panel / Dialogue
alt.Player.prototype.showAtmPanel = function showAtmPanel() {
    alt.emitClient(this, 'atm:ShowDialogue');
};

// Close the ATM Panel / Dialogue
alt.Player.prototype.closeAtmPanel = function closeAtmPanel() {
    alt.emitClient(this, 'atm:CloseDialogue');
};

// Update the ATM Cash balance the user sees.
alt.Player.prototype.updateAtmCash = function updateAtmCash(value) {
    alt.emitClient(this, 'atm:UpdateCash', value);
};

// Update the ATM Bank balance the user sees.
alt.Player.prototype.updateAtmBank = function updateAtmBank(value) {
    alt.emitClient(this, 'atm:UpdateBank', value);
};

// Show the ATM success message.
alt.Player.prototype.showAtmSuccess = function showAtmSuccess(msg) {
    alt.emitClient(this, 'atm:ShowSuccess', msg);
};

// =================================
/**
 * Show the Clothing Dialogue
 */
alt.Player.prototype.showClothingDialogue = function showClothingDialogue() {
    alt.emitClient(this, 'clothing:ShowDialogue');
};

/**
 * Close the clothing Dialogue.
 */
alt.Player.prototype.closeClothingDialogue = function closeClothingDialogue() {
    alt.emitClient(this, 'clothing:CloseDialogue');
};

// =================================
/**
 * Set / Save the player's Roleplay Info
 */
alt.Player.prototype.saveRoleplayInfo = function saveRoleplayInfo(name) {
    this.data.name = name;
    this.setSyncedMeta('name', this.data.name);
    this.saveField(this.data.id, 'name', this.data.name);
};

// =================================
// INVENTORY
// Add an item to a this.
alt.Player.prototype.addItem = function addItem(
    key,
    quantity,
    props = {},
    skipStackable = false,
    skipSave = false,
    name = undefined,
    icon = undefined,
    keyOverride = undefined
) {
    const item = Items[key];
    if (!item) {
        console.log('Item does not exist.');
        return false;
    }

    const base = BaseItems[Items[key].base];
    if (!base) {
        console.log('Base item does not exist.');
        return false;
    }

    const clonedItem = { ...item };
    if (keyOverride) {
        clonedItem.key = keyOverride;
    }

    if (name) {
        clonedItem.name = name;
    }

    if (!skipStackable) {
        const inventoryIndex = this.inventory.findIndex(item => {
            if (item && item.key === clonedItem.key) return item;
        });

        if (base.abilities.stack && inventoryIndex >= 0) {
            this.inventory[inventoryIndex].quantity += quantity;
            this.saveInventory();
            return true;
        }
    }

    clonedItem.props = props;
    clonedItem.quantity = quantity;
    clonedItem.hash = generateHash(JSON.stringify(clonedItem));
    if (icon) {
        clonedItem.icon = icon;
    }

    const nullIndex = this.inventory.findIndex(item => !item);
    if (nullIndex >= 28) {
        this.send('{FF0000} No room for item in inventory.');
        return false;
    }

    this.inventory[nullIndex] = clonedItem;

    if (!skipSave) {
        this.saveInventory();
    }
    return true;
};

// Remove an Item from the Player
// Finds all matching items; adds up quantities.
// Loops through each found item and removes quantity
// when quantity is zero; it stops removing.
// This allows for split stacks.
alt.Player.prototype.subItem = function subItem(key, quantity) {
    const indexes = [];
    const entries = this.inventory.entries();
    for (let entry of entries) {
        const [_index, _data] = entry;
        if (_data && _data.key === key) {
            indexes.push(_index);
        }
    }

    if (indexes.length <= 0) {
        return false;
    }

    quantity = parseInt(quantity);

    let total = 0;
    indexes.forEach(currIndex => {
        total += parseInt(this.inventory[currIndex].quantity);
    });

    if (total < quantity) {
        return false;
    }

    indexes.forEach(currIndex => {
        if (quantity === 0) return;
        if (this.inventory[currIndex].quantity < quantity) {
            const currQuantity = parseInt(this.inventory[currIndex].quantity);
            this.inventory[currIndex].quantity -= parseInt(currQuantity);
            quantity -= parseInt(currQuantity);
        } else {
            this.inventory[currIndex].quantity -= parseInt(quantity);
            quantity -= parseInt(quantity);
        }

        if (this.inventory[currIndex].quantity <= 0) {
            this.inventory[currIndex] = null;
        }
    });

    this.saveInventory();
    return true;
};

alt.Player.prototype.subItemByHash = function subItemByHash(hash) {
    const index = this.inventory.findIndex(item => item && item.hash === hash);
    if (index <= -1) return false;
    this.inventory[index] = null;
    this.saveInventory();
    return true;
};

alt.Player.prototype.hasQuantityOfItem = function hasQuantityOfItem(key, quantity) {
    const indexes = [];
    const entries = this.inventory.entries();
    for (let entry of entries) {
        const [_index, _data] = entry;
        if (_data && _data.key === key) {
            indexes.push(_index);
            continue;
        }
    }

    if (indexes.length <= 0) {
        return false;
    }

    quantity = parseInt(quantity);

    let total = 0;
    indexes.forEach(currIndex => {
        total += parseInt(this.inventory[currIndex].quantity);
    });

    if (total < quantity) {
        return false;
    }
    return true;
};

alt.Player.prototype.removeItemsOnArrest = function removeItemsOnArrest() {
    const illegalBaseItems = ['weapon', 'boundweapon', 'unrefined', 'refineddrug'];

    this.inventory.forEach((item, index) => {
        if (!item) return;
        if (illegalBaseItems.includes(item.base)) {
            this.inventory[index] = null;
        }
    });

    this.equipment.forEach((item, index) => {
        if (!item) return;
        if (illegalBaseItems.includes(item.base)) {
            this.equipment[index] = null;
        }
    });

    this.saveInventory();
};

alt.Player.prototype.dropItemsOnDeath = function dropItemsOnDeath() {
    if (!this.inventory) return;
    this.inventory.forEach((item, index) => {
        if (!item) return;
        if (item.base.includes('weapon') || item.base.includes('unrefined')) {
            const itemClone = { ...item };
            dropNewItem(this.pos, itemClone);
            this.inventory[index] = null;
        }
    });
    this.saveInventory();
};

alt.Player.prototype.saveInventory = function saveInventory() {
    this.data.inventory = JSON.stringify(this.inventory);
    this.data.equipment = JSON.stringify(this.equipment);
    this.saveField(this.data.id, 'inventory', this.data.inventory);
    this.saveField(this.data.id, 'equipment', this.data.equipment);
    this.syncInventory(true);
};

alt.Player.prototype.syncInventory = function syncInventory(cleanse = false) {
    if (cleanse) {
        const inventory = JSON.parse(this.data.inventory);
        inventory.forEach(item => {
            if (item) {
                item = objectToNull(item);
            }
        });
        this.data.inventory = JSON.stringify(inventory);
    }

    this.equipment = JSON.parse(this.data.equipment);
    this.inventory = JSON.parse(this.data.inventory);

    this.emitMeta('equipment', this.data.equipment);
    this.emitMeta('inventory', this.data.inventory);

    if (this.equipment[11]) {
        if (
            this.equipment[11].base === 'weapon' ||
            this.equipment[11].base === 'boundweapon'
        ) {
            this.setSyncedMeta('prop:11', undefined);
            this.setWeapon(this.equipment[11].props.hash);
        } else {
            this.removeAllWeapons();
            this.setSyncedMeta('prop:11', this.equipment[11].props.propData);
        }
    } else {
        this.setSyncedMeta('prop:11', undefined);
        this.removeAllWeapons();
    }
};

alt.Player.prototype.searchItems = function searchItems() {
    let hasDrugs = false;
    let hasWeapons = false;

    this.inventory.forEach(item => {
        if (!item) return;
        if (item.base === 'refineddrug') {
            hasDrugs = true;
            return;
        }

        if (item.base === 'weapon') {
            hasWeapons = true;
        }

        if (item.base === 'boundweapon') {
            hasWeapons = true;
        }
    });

    return { hasDrugs, hasWeapons };
};

alt.Player.prototype.equipItem = function equipItem(itemIndex, equipmentIndex) {
    let equippedItem = { ...this.equipment[equipmentIndex] };
    let inventoryItem = { ...this.inventory[itemIndex] };

    if (equippedItem) {
        equippedItem = objectToNull(equippedItem);
    }

    if (inventoryItem) {
        inventoryItem = objectToNull(inventoryItem);
    }

    // Going in to hand.
    if (inventoryItem.props && inventoryItem.props.lvl) {
        const skills = JSON.parse(this.data.skills);
        if (inventoryItem.props.lvl.skill) {
            const skill = inventoryItem.props.lvl.skill;
            const level = getLevel(skills[skill].xp);

            if (level < inventoryItem.props.lvl.requirement) {
                this.notify(
                    `You do not have level ${inventoryItem.props.lvl.requirement} ${skill}.`
                );
                this.syncInventory();
                return;
            }
        }
    }

    this.equipment[equipmentIndex] = inventoryItem;
    this.inventory[itemIndex] = equippedItem;
    this.saveInventory();
};

alt.Player.prototype.unequipItem = function unequipItem(equipmentIndex) {
    let equippedItem = { ...this.equipment[equipmentIndex] };

    if (equippedItem) {
        equippedItem = objectToNull(equippedItem);
    }

    if (!equippedItem) return false;

    if (
        this.addItem(
            equippedItem.key,
            equippedItem.quantity,
            equippedItem.props,
            false,
            false,
            equippedItem.name
        )
    ) {
        if (equippedItem.base === 'fishingrod') {
            if (this.job) {
                quitJob(this, false, true);
                this.send('You have quit fishing.');
            }
        }

        this.equipment[equipmentIndex] = null;
        this.saveInventory();
        return true;
    }

    this.syncInventory();
    return false;
};

alt.Player.prototype.splitItem = function splitItem(index) {
    if (this.splitting) return;
    this.splitting = true;

    if (!this.inventory[index]) {
        this.syncInventory();
        this.splitting = false;
        return false;
    }

    if (this.inventory[index].quantity <= 1) {
        this.syncInventory();
        this.splitting = false;
        return false;
    }

    const item = { ...this.inventory[index] };
    const split = Math.floor(parseInt(item.quantity) / 2);
    const remainder = parseInt(item.quantity) - split;
    let nullIndexes = 0;
    this.inventory.forEach(item => {
        if (!item) {
            nullIndexes += 1;
        }
    });

    if (nullIndexes <= 1) {
        this.notify('No room to split item.');
        this.splitting = false;
        return false;
    }

    this.inventory[index] = null;
    this.addItem(item.key, parseInt(split), item.props, true, true);
    this.addItem(item.key, parseInt(remainder), item.props, true, true);

    this.saveInventory();
    this.splitting = false;
    return true;
};

alt.Player.prototype.removeItem = function removeItem(index) {
    this.inventory[index] = null;
    this.saveInventory();
};

alt.Player.prototype.setWeapon = function setWeapon(hash) {
    this.removeAllWeapons();
    this.giveWeapon(hash, 999, true);
};

alt.Player.prototype.getNullSlots = function getNullSlots() {
    let count = 0;
    this.inventory.forEach((item, index) => {
        if (index >= 28) return;
        if (!item) {
            count += 1;
            return;
        }
    });
    return count;
};

alt.Player.prototype.hasItem = function hasItem(base) {
    // Check for matching base.
    let index = this.inventory.findIndex(item => {
        if (item && item.base === base) return item;
    });

    if (index !== -1) {
        return true;
    }

    // Check for matching key.
    index = this.inventory.findIndex(item => {
        if (item && item.key === base) return item;
    });

    if (index !== -1) {
        return true;
    }

    index = this.equipment.findIndex(item => {
        if (item && item.key === base) return item;
    });

    if (index !== -1) {
        return true;
    }

    index = this.equipment.findIndex(item => {
        if (item && item.base === base) return item;
    });

    if (index !== -1) {
        return true;
    }

    return false;
};

alt.Player.prototype.addStarterItems = function addStartItems() {
    let shirt = { ...Items.shirt };
    shirt.props = {
        restriction: -1,
        female: [
            { id: 11, value: 2, texture: 2 },
            { id: 8, value: 2, texture: 0 },
            { id: 3, value: 2, texture: 0 }
        ],
        male: [
            { id: 11, value: 16, texture: 0 },
            { id: 8, value: 16, texture: 0 },
            { id: 3, value: 0, texture: 0 }
        ]
    };
    shirt.hash = generateHash(shirt);

    let pants = { ...Items.pants };
    pants.props = {
        restriction: -1,
        female: [{ id: 4, value: 0, texture: 2 }],
        male: [{ id: 4, value: 0, texture: 0 }]
    };
    pants.hash = generateHash(pants);

    let shoes = { ...Items.shoes };
    shoes.props = {
        restriction: -1,
        female: [{ id: 6, value: 3, texture: 0 }],
        male: [{ id: 6, value: 1, texture: 0 }]
    };
    shoes.hash = generateHash(shoes);

    this.equipment[7] = shirt;
    this.equipment[10] = pants;
    this.equipment[13] = shoes;

    this.addItem('pickaxe', 1, Items.pickaxe.props);
    this.addItem('hammer', 1, Items.hammer.props);
    this.addItem('axe', 1, Items.axe.props);
    this.addItem('fishingrod', 1, Items.fishingrod.props);
};

// =================================
// SOUND
alt.Player.prototype.playAudio = function playAudio(soundName) {
    alt.emitClient(this, 'sound:PlayAudio', soundName);
};

alt.Player.prototype.playAudio3D = function playAudio3D(target, soundName) {
    alt.emitClient(this, 'sound:PlayAudio3D', target, soundName);
};

// =================================
// Animation
alt.Player.prototype.playAnimation = function playAnimation(
    dictionary,
    name,
    durationInMS,
    flag
) {
    alt.emitClient(
        this,
        'animation:PlayAnimation',
        this,
        dictionary,
        name,
        durationInMS,
        flag
    );
};

// =================================
// Vehicles
alt.Player.prototype.spawnVehicles = function spawnVehicles() {
    if (!this.vehicles) {
        this.vehicles = [];
        this.emitMeta('pedflags', true);
    }

    db.fetchAllByField('guid', this.data.id, 'Vehicle', vehicles => {
        if (vehicles === undefined) return;

        if (vehicles.length <= 0) return;

        vehicles.forEach(veh => {
            if (!this) return;
            spawnVehicle(this, veh);
        });
    });
};

alt.Player.prototype.hasVehicleSlot = function hasVehicleSlot() {
    if (Array.isArray(this.vehicles)) {
        const vehicles = this.vehicles.filter(veh => veh.data);
        const extraSlots = parseInt(this.data.extraVehicleSlots);
        if (vehicles.length >= Config.defaultPlayerMaxVehicles + extraSlots) {
            return false;
        }
    }
    return true;
};

alt.Player.prototype.addVehicle = function addVehicle(model, pos, rot) {
    if (Array.isArray(this.vehicles)) {
        const vehicles = this.vehicles.filter(veh => veh.data);
        const extraSlots = parseInt(this.data.extraVehicleSlots);
        if (vehicles.length >= Config.defaultPlayerMaxVehicles + extraSlots) {
            this.send(`You are not allowed to have any additional vehicles.`);
            return false;
        }
    }

    try {
        const tempVeh = new alt.Vehicle(model, 0, 0, 0, 0, 0, 0);
        tempVeh.destroy();
    } catch (err) {
        console.error(`${model} is not a valid vehicle model.`);
        return false;
    }

    const nextVehicleID = fetchNextVehicleID();
    const veh = {
        id: nextVehicleID,
        guid: this.data.id,
        model,
        position: JSON.stringify(pos),
        rotation: JSON.stringify(rot),
        stats: null,
        customization: null
    };

    spawnVehicle(this, veh, true);
    db.upsertData(veh, 'Vehicle', () => {});
    return true;
};

alt.Player.prototype.deleteVehicle = function deleteVehicle(id) {
    db.deleteByIds([id], 'Vehicle', res => {
        console.log(res);
    });
};

// =================
//
alt.Player.prototype.animatedText = function animatedText(text, duration) {
    alt.emitClient(this, 'text:Animated', text, duration);
};

// =================
// Vehicle Funcs
alt.Player.prototype.eject = function eject() {
    alt.emitClient(this, 'vehicle:Eject');
};

alt.Player.prototype.ejectSlowly = function ejectSlowly() {
    alt.emitClient(this, 'vehicle:Eject', true);
};

// =================
// Skill Funcs
alt.Player.prototype.syncXP = function syncXP() {
    this.emitMeta('skills', this.data.skills);
};

// =================
// Phone
alt.Player.prototype.addContact = function addContact(number) {
    let contacts = JSON.parse(this.data.contacts);
    if (contacts.includes(number)) {
        return false;
    }

    contacts.push(number);
    this.data.contacts = JSON.stringify(contacts);
    this.saveField(this.data.id, 'contacts', this.data.contacts);
    return true;
};

alt.Player.prototype.removeContact = function removeContact(number) {
    let contacts = JSON.parse(this.data.contacts);
    let index = contacts.findIndex(x => x === number);
    if (index <= -1) {
        return false;
    }

    contacts.splice(index, 1);
    this.data.contacts = JSON.stringify(contacts);
    this.saveField(this.data.id, 'contacts', this.data.contacts);
    return true;
};

alt.Player.prototype.hasContact = function hasContact(number) {
    let contacts = JSON.parse(this.data.contacts);
    let index = contacts.findIndex(num => num === number);
    if (index <= -1) {
        return false;
    }
    return true;
};

alt.Player.prototype.syncContacts = function syncContacts() {
    const contacts = JSON.parse(this.data.contacts);
    if (contacts.length >= 1) {
        const contactList = [];
        contacts.forEach(contact => {
            const target = alt.Player.all.find(p => p.data && p.data.id === contact);
            const isOnline = target ? true : false;
            contactList.push({
                id: contact,
                name: getCharacterName(contact),
                online: isOnline
            });
        });
        this.emitMeta('contactList', contactList);
    } else {
        this.emitMeta('contactList', []);
    }
};

// ==============================
// Doors
alt.Player.prototype.syncDoorStates = function syncDoorStates() {
    Object.keys(doorStates).forEach(state => {
        alt.emitClient(
            null,
            'door:Lock',
            doorStates[state].type,
            doorStates[state].pos,
            doorStates[state].heading
        );
    });
};

// =================
// Prisoner
alt.Player.prototype.setArrestTime = function setArrestTime(ms) {
    if (ms <= 0) {
        this.data.arrestTime = '-1';
        this.pos = {
            x: 441.4432067871094,
            y: -982.8604125976562,
            z: 30.68960952758789
        };
        this.notice('You are now a free citizen.');
    } else {
        this.data.arrestTime = `${Date.now() + ms}`;
    }

    this.saveField(this.data.id, 'arrestTime', this.data.arrestTime);
    this.syncArrest();
};

alt.Player.prototype.syncArrest = function syncArrest() {
    if (Date.now() < parseInt(this.data.arrestTime)) {
        this.setSyncedMeta('namecolor', '{ff8400}');
    } else {
        this.setSyncedMeta('namecolor', null);
    }
};

// ===============================
// Bonuses / Loyalty
alt.Player.prototype.addVehicleSlot = function addVehicleSlot(amount = 1) {
    this.data.extraVehicleSlots += amount;
    this.saveField(this.data.id, 'extraVehicleSlots', this.data.extraVehicleSlots);
};

alt.Player.prototype.addHouseSlot = function addHouseSlot(amount = 1) {
    this.data.extraHouseSlots += amount;
    this.saveField(this.data.id, 'extraHouseSlots', this.data.extraHouseSlots);
};

alt.Player.prototype.addBusinessSlot = function addBusinessSlot(amount = 1) {
    this.data.extraBusinessSlots += amount;
    this.saveField(this.data.id, 'extraBusinessSlots', this.data.extraBusinessSlots);
};

alt.on('orp:PlayerFunc', (...args) => {
    const passedPlayer = args.shift();
    const player = alt.Player.all.find(x => x.id === passedPlayer.id);
    if (!player) {
        console.error('Player was not found from PlayerFunc call.');
        return;
    }

    if (args.length <= 0) return;
    const funcName = args.shift();

    if (!player[funcName]) {
        console.error('That function does not exist for the player.');
        return;
    }

    if (funcName === 'send') {
        args = args.join(' ');
    }

    if (args.length >= 1) {
        player[funcName](args);
    } else {
        player[funcName]();
    }
});
