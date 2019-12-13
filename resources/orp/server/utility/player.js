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

export class ExtPlayer {
    constructor(player) {
        this.player = player;
        return new Promise(resolve => {
            const functionNames = Object.getOwnPropertyNames(ExtPlayer.prototype);
            functionNames.forEach(name => {
                if (this[name]) {
                    player[name] = this[name].bind(this);
                }
            });
            return resolve(true);
        });
    }

    /**
     *  Used to emit meta to the local player and server.
     *  Can be fetched on the client side by doing getMeta.
     * @memberof player
     * @param {any} key
     * @param {any} value
     */
    emitMeta(key, value) {
        this.player.setMeta(key, value);
        alt.emitClient(this.player, 'meta:Emit', key, value);
    }

    /**
     *  Used to save all `this.player.data` information.
     * @memberof player
     */
    save() {
        db.upsertData(this.player.data, 'Character', () => {});
    }

    /**
     *  Used to save a specific id, field, and value.
     * @memberof player
     * @param {string/number} id User's database id. ie. this.player.data.id
     * @param {string} fieldName The field name to use.
     * @param {any} fieldValue The field value to apply.
     */
    saveField(id, fieldName, fieldValue) {
        db.updatePartialData(id, { [fieldName]: fieldValue }, 'Character', () => {});
    }

    setRank(flag) {
        this.player.rank = flag;
        modifyRank(this.player.pgid, flag);
        db.updatePartialData(this.player.accountID, { rank: flag }, 'Account', () => {
            alt.log(`Updated ${this.player.pgid} to rank ${flag}`);
        });
    }

    /**
     * Updates the player's current playing time.
     * Calculated from start time; until now. Then resets it.
     * @memberof player
     */
    addRewardPoint() {
        this.player.saveField(
            this.player.data.id,
            'rewardpoints',
            this.player.data.rewardpoints + 1
        );
        this.player.saveField(
            this.player.data.id,
            'totalrewardpoints',
            this.player.data.totalrewardpoints + 1
        );
    }

    /**
     * Returns the reward points a player has.
     * @memberof player
     * @returns int
     */
    getRewardPoints() {
        return parseInt(this.player.data.rewardpoints);
    }

    /**
     * Returns the total reward points issued to a user.
     * @returns int
     */
    getTotalRewardPoints() {
        return parseInt(this.player.data.totalrewardpoints);
    }

    getTotalPlayTime() {
        const totalPoints = this.player.getTotalRewardPoints();
        const timePerPoint = Config.timeRewardTime;
        const timeInMS = totalPoints * timePerPoint;
        return timeInMS / 1000 / 60 / 60;
    }

    setLastLogin() {
        const date = new Date(this.player.data.lastlogin * 1).toString();
        this.player.send(`{FFFF00}Last Login: ${date}`);
        this.player.data.lastlogin = Date.now();
        this.player.saveField(
            this.player.data.id,
            'lastlogin',
            this.player.data.lastlogin
        );
    }

    /**
     *  Send a message to the this.player.
     * @memberof player
     * @param {string} msg The message to send to the user.
     */
    send(msg) {
        alt.emitClient(this.player, 'chat:Send', msg);
    }

    /**
     *  Display a message in the center screen to the user.
     * @memberof player
     * @param {string} msg The message to send to the user.
     */
    notice(msg) {
        this.player.emitMeta('hudNotice', msg);
    }

    /**
     *  Display a notification on the right-hand side.
     * @memberof player
     * @param {string} msg The message to send to the user.
     */
    notify(msg) {
        this.player.emitMeta('queueNotification', msg);
    }

    saveDimension(doorID) {
        this.player.dimension = doorID;
        this.player.data.dimension = doorID;
        this.player.saveField(this.player.data.id, 'dimension', doorID);
    }

    // ====================================
    // Weather & Time
    updateTime() {
        systemsTime.updatePlayerTime(this.player);
    }

    /**
     *  Save the user's location.
     * @memberof player
     * @param {Vector3} pos A vector3 object.
     */
    saveLocation(pos) {
        this.player.data.lastposition = pos;
        this.player.saveField(this.player.data.id, 'lastposition', JSON.stringify(pos));
    }

    /**
     *  Save the player's dead state.
     * @memberof player
     * @param {bool} value isPlayerDead?
     */
    saveDead(value) {
        this.player.data.dead = value;

        if (!value) {
            this.player.saveField(this.player.data.id, 'health', 200);
            this.player.saveField(this.player.data.id, 'armour', 0);
        }

        this.player.saveField(this.player.data.id, 'dead', value);
    }

    /**
     *  Save Common Data; health, armour, position.
     * @memberof player
     */
    saveData() {
        this.player.data.health = this.player.health;
        this.player.data.armour = this.player.armour;
        this.player.data.lastposition = JSON.stringify(this.player.pos);
        this.player.save();
    }

    /**
     *  Synchronize interaction blips for the interaction system.
     * @memberof player
     */
    syncInteractionBlips() {
        systemsInteraction.syncBlips(this.player);
    }

    /**
     *  Remove pedestrian blood.
     * @memberof player
     */
    clearBlood() {
        alt.emitClient(this.player, 'respawn:ClearPedBloodDamage');
    }

    /**
     *  Fade the screen in and out over a period of time.
     * @memberof player
     * @param {number} fadeInOutMS Fade out for how long.
     * @param {number} timeoutMS Fade in after this time.
     */
    screenFadeOutFadeIn(fadeInOutMS, timeoutMS) {
        alt.emitClient(this.player, 'screen:FadeOutFadeIn', fadeInOutMS, timeoutMS);
    }

    /**
     *  Fade the screen out.
     * @memberof player
     * @param {number} timeInMS How long to fade the screen out for.
     */
    screenFadeOut(timeInMS) {
        alt.emitClient(this.player, 'screen:FadeOut', timeInMS);
    }

    /**
     *  Fade the screen in.
     * @memberof player
     * @param {number} timeInMS How long to fade the screen in.
     */
    screenFadeIn(timeInMS) {
        alt.emitClient(this.player, 'screen:FadeIn', timeInMS);
    }

    /**
     *  Blur the screen.
     * @memberof player
     * @param {number} timeInMS How long it takes to blur the screen.
     */
    screenBlurOut(timeInMS) {
        alt.emitClient(this.player, 'screen:BlurOut', timeInMS);
    }

    /**
     *  Unblur the screen.
     * @memberof player
     * @param {number} timeInMS How long to unblur the screen.
     */
    screenBlurIn(timeInMS) {
        alt.emitClient(this.player, 'screen:BlurIn', timeInMS);
    }

    /**
     *  Revive the this.player.
     * @memberof player
     */
    revive() {
        this.player.screenFadeOutFadeIn(1000, 5000);

        if (!this.player.revivePos) {
            this.player.spawn(
                this.player.pos.x,
                this.player.pos.y,
                this.player.pos.z,
                2000
            );
        } else {
            this.player.spawn(
                this.player.revivePos.x,
                this.player.revivePos.y,
                this.player.revivePos.z,
                2000
            );
        }

        this.player.clearBlood();
        this.player.setHealth(200);
        this.player.setArmour(0);
        this.player.hasDied = false;
        this.player.revivePos = undefined;
        this.player.reviveTime = undefined;
        this.player.reviving = false;
        this.player.isArrested = false;
        this.player.lastLocation = undefined;
        this.player.sendToJail = false;
        this.player.saveDead(false);
        this.player.taxIncome(Config.hospitalPctFee, true, 'Hospital Fee');
        this.player.send('You have been revived.');
        this.player.setSyncedMeta('dead', false);
    }

    /**
     * Set the user's health.
     * @memberof player
     * @param {number} amount The amount to set the user's health.
     */
    setHealth(amount) {
        this.player.health = amount;
        this.player.data.health = amount;
        this.player.lastHealth = this.player.health;
    }

    /**
     *  Set the user's armour.
     * @memberof player
     * @param {number} amount The amount to set the user's armour.
     */
    setArmour(amount) {
        this.player.armour = amount;
        this.player.data.armour = amount;
        this.player.lastArmour = this.player.armour;
    }

    // ====================================
    // Face Customizer
    showFaceCustomizerDialogue(location) {
        if (location !== undefined) {
            this.player.lastLocation = location;
        } else {
            this.player.lastLocation = this.player.pos;
        }

        this.player.dimension = parseInt(this.player.data.id);
        alt.emitClient(this.player, 'face:ShowDialogue');
    }

    applyFace() {
        if (!this.player.data.sexgroup) return;
        const sexGroup = JSON.parse(this.player.data.sexgroup);
        if (sexGroup[0].value === 0) {
            this.player.model = 'mp_f_freemode_01';
        } else {
            this.player.model = 'mp_m_freemode_01';
        }

        Object.keys(this.player.data).forEach(key => {
            if (!key.includes('group')) return;
            this.player.emitMeta(key, this.player.data[key]);
        });
    }

    // ====================================
    // Roleplay Name Dialogues
    showRoleplayInfoDialogue() {
        alt.emitClient(this.player, 'roleplayinfo:ShowDialogue');
    }

    closeRoleplayInfoDialogue() {
        alt.emitClient(this.player, 'roleplayinfo:CloseDialogue');
    }

    // ====================================
    // Money Functions
    // Remove cash from the this.player.
    syncMoney() {
        this.player.emitMeta('bank', this.player.data.bank);
        this.player.emitMeta('cash', this.player.data.cash);
    }

    subCash(value) {
        let absValue = Math.abs(parseFloat(value)) * 1;

        if (this.player.data.cash < absValue) return false;

        this.player.data.cash -= absValue;
        this.player.data.cash = Number.parseFloat(this.player.data.cash).toFixed(2) * 1;
        this.player.saveField(this.player.data.id, 'cash', this.player.data.cash);
        this.player.syncMoney();
        return true;
    }

    // Add cash to the this.player.
    addCash(value) {
        let absValue = Math.abs(parseFloat(value));

        if (this.player.data.cash + absValue > 92233720368547758.07) {
            absValue = 0;
        }

        this.player.data.cash += absValue;
        this.player.data.cash = Number.parseFloat(this.player.data.cash).toFixed(2) * 1;
        this.player.saveField(this.player.data.id, 'cash', this.player.data.cash);
        this.player.syncMoney();
        return true;
    }

    // Add cash to the bank.
    addBank(value) {
        let absValue = Math.abs(parseFloat(value));

        if (this.player.data.bank + absValue > 92233720368547758.07) {
            absValue = 0;
        }

        this.player.data.bank += absValue;
        this.player.data.bank = Number.parseFloat(this.player.data.bank).toFixed(2) * 1;
        this.player.saveField(this.player.data.id, 'bank', this.player.data.bank);
        this.player.syncMoney();
        return true;
    }

    // Subtract the cash from the bank.
    subBank(value) {
        let absValue = Math.abs(parseFloat(value)) * 1;

        if (this.player.data.bank < absValue) return false;

        this.player.data.bank -= absValue;
        this.player.data.bank = Number.parseFloat(this.player.data.bank).toFixed(2) * 1;
        this.player.saveField(this.player.data.id, 'bank', this.player.data.bank);
        this.player.syncMoney();
        return true;
    }

    // Get the player's cash balance.
    getCash() {
        return this.player.data.cash;
    }

    // Get the player's bank balance.
    getBank() {
        return this.player.data.bank;
    }

    subToZero(amount) {
        const bank = this.player.data.bank;
        const cash = this.player.data.cash;
        const removed = Math.abs(bank - amount);
        this.player.data.bank = bank - amount <= 0 ? 0 : bank - amount;

        if (removed > 0) {
            this.player.data.cash = cash - removed <= 0 ? 0 : cash - removed;
        }

        this.player.saveField(this.player.data.id, 'bank', this.player.data.bank);
        this.player.saveField(this.player.data.id, 'cash', this.player.data.cash);
        this.player.syncMoney();
    }

    taxIncome(percentage, useHighest, reason) {
        let cash = this.player.getCash(); // 0
        let bank = this.player.getBank(); // 1

        let taxType = 0;

        if (useHighest) {
            if (cash > bank) {
                taxType = 0;
            } else {
                taxType = 1;
            }
        } else {
            if (cash < bank) {
                taxType = 0;
            } else {
                taxType = 1;
            }
        }

        if (taxType === 0) {
            let cashTaxAmount = cash * percentage;
            this.player.subCash(cashTaxAmount);
            this.player.send(`You were taxed: $${cashTaxAmount.toFixed(2) * 1}`);
        } else {
            let bankTaxAmount = bank * percentage;
            this.player.subBank(bankTaxAmount);
            this.player.saveField(this.player.data.id, 'bank', this.player.data.bank);
            this.player.send(`You were taxed: $${bankTaxAmount.toFixed(2) * 1}`);
        }

        this.player.send(`Reason: ${reason}`);
    }

    // ====================================
    // Load Blip for client.
    createBlip(category, pos, sprite, colour, label) {
        alt.emitClient(
            this.player,
            'blip:CreateBlip',
            category,
            pos,
            sprite,
            colour,
            label
        );
    }

    // ====================================
    // Show the ATM Panel / Dialogue
    showAtmPanel() {
        alt.emitClient(this.player, 'atm:ShowDialogue');
    }

    // Close the ATM Panel / Dialogue
    closeAtmPanel() {
        alt.emitClient(this.player, 'atm:CloseDialogue');
    }

    // Update the ATM Cash balance the user sees.
    updateAtmCash(value) {
        alt.emitClient(this.player, 'atm:UpdateCash', value);
    }

    // Update the ATM Bank balance the user sees.
    updateAtmBank(value) {
        alt.emitClient(this.player, 'atm:UpdateBank', value);
    }

    // Show the ATM success message.
    showAtmSuccess(msg) {
        alt.emitClient(this.player, 'atm:ShowSuccess', msg);
    }

    // =================================
    /**
     * Show the Clothing Dialogue
     */
    showClothingDialogue() {
        alt.emitClient(this.player, 'clothing:ShowDialogue');
    }

    /**
     * Close the clothing Dialogue.
     */
    closeClothingDialogue() {
        alt.emitClient(this.player, 'clothing:CloseDialogue');
    }

    // =================================
    /**
     * Set / Save the player's Roleplay Info
     */
    saveRoleplayInfo(name) {
        this.player.data.name = name;
        this.player.setSyncedMeta('name', this.player.data.name);
        this.player.saveField(this.player.data.id, 'name', this.player.data.name);
    }

    // =================================
    // INVENTORY
    // Add an item to a this.player.
    addItem(
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
            const inventoryIndex = this.player.inventory.findIndex(item => {
                if (item && item.key === clonedItem.key) return item;
            });

            if (base.abilities.stack && inventoryIndex >= 0) {
                this.player.inventory[inventoryIndex].quantity += quantity;
                this.player.saveInventory();
                return true;
            }
        }

        clonedItem.props = props;
        clonedItem.quantity = quantity;
        clonedItem.hash = generateHash(JSON.stringify(clonedItem));
        if (icon) {
            clonedItem.icon = icon;
        }

        const nullIndex = this.player.inventory.findIndex(item => !item);
        if (nullIndex >= 28) {
            this.player.send('{FF0000} No room for item in inventory.');
            return false;
        }

        this.player.inventory[nullIndex] = clonedItem;

        if (!skipSave) {
            this.player.saveInventory();
        }
        return true;
    }

    // Remove an Item from the Player
    // Finds all matching items; adds up quantities.
    // Loops through each found item and removes quantity
    // when quantity is zero; it stops removing.
    // This allows for split stacks.
    subItem(key, quantity) {
        const indexes = [];
        const entries = this.player.inventory.entries();
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
            total += parseInt(this.player.inventory[currIndex].quantity);
        });

        if (total < quantity) {
            return false;
        }

        indexes.forEach(currIndex => {
            if (quantity === 0) return;
            if (this.player.inventory[currIndex].quantity < quantity) {
                const currQuantity = parseInt(this.player.inventory[currIndex].quantity);
                this.player.inventory[currIndex].quantity -= parseInt(currQuantity);
                quantity -= parseInt(currQuantity);
            } else {
                this.player.inventory[currIndex].quantity -= parseInt(quantity);
                quantity -= parseInt(quantity);
            }

            if (this.player.inventory[currIndex].quantity <= 0) {
                this.player.inventory[currIndex] = null;
            }
        });

        this.player.saveInventory();
        return true;
    }

    subItemByHash(hash) {
        const index = this.player.inventory.findIndex(item => item && item.hash === hash);
        if (index <= -1) return false;
        this.player.inventory[index] = null;
        this.player.saveInventory();
        return true;
    }

    hasQuantityOfItem(key, quantity) {
        const indexes = [];
        const entries = this.player.inventory.entries();
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
            total += parseInt(this.player.inventory[currIndex].quantity);
        });

        if (total < quantity) {
            return false;
        }
        return true;
    }

    removeItemsOnArrest() {
        const illegalBaseItems = ['weapon', 'boundweapon', 'unrefined', 'refineddrug'];

        this.player.inventory.forEach((item, index) => {
            if (!item) return;
            if (illegalBaseItems.includes(item.base)) {
                this.player.inventory[index] = null;
            }
        });

        this.player.equipment.forEach((item, index) => {
            if (!item) return;
            if (illegalBaseItems.includes(item.base)) {
                this.player.equipment[index] = null;
            }
        });

        this.player.saveInventory();
    }

    dropItemsOnDeath() {
        if (!this.player.inventory) return;
        this.player.inventory.forEach((item, index) => {
            if (!item) return;
            if (item.base.includes('weapon') || item.base.includes('unrefined')) {
                const itemClone = { ...item };
                dropNewItem(this.player.pos, itemClone);
                this.player.inventory[index] = null;
            }
        });
        this.player.saveInventory();
    }

    saveInventory() {
        this.player.data.inventory = JSON.stringify(this.player.inventory);
        this.player.data.equipment = JSON.stringify(this.player.equipment);
        this.player.saveField(
            this.player.data.id,
            'inventory',
            this.player.data.inventory
        );
        this.player.saveField(
            this.player.data.id,
            'equipment',
            this.player.data.equipment
        );
        this.player.syncInventory(true);
    }

    syncInventory(cleanse = false) {
        if (cleanse) {
            const inventory = JSON.parse(this.player.data.inventory);
            inventory.forEach(item => {
                if (item) {
                    item = objectToNull(item);
                }
            });
            this.player.data.inventory = JSON.stringify(inventory);
        }

        this.player.equipment = JSON.parse(this.player.data.equipment);
        this.player.inventory = JSON.parse(this.player.data.inventory);

        this.player.emitMeta('equipment', this.player.data.equipment);
        this.player.emitMeta('inventory', this.player.data.inventory);

        if (this.player.equipment[11]) {
            if (
                this.player.equipment[11].base === 'weapon' ||
                this.player.equipment[11].base === 'boundweapon'
            ) {
                this.player.setSyncedMeta('prop:11', undefined);
                this.player.setWeapon(this.player.equipment[11].props.hash);
            } else {
                this.player.removeAllWeapons();
                this.player.setSyncedMeta(
                    'prop:11',
                    this.player.equipment[11].props.propData
                );
            }
        } else {
            this.player.setSyncedMeta('prop:11', undefined);
            this.player.removeAllWeapons();
        }
    }

    searchItems() {
        let hasDrugs = false;
        let hasWeapons = false;

        this.player.inventory.forEach(item => {
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
    }

    equipItem(itemIndex, equipmentIndex) {
        let equippedItem = { ...this.player.equipment[equipmentIndex] };
        let inventoryItem = { ...this.player.inventory[itemIndex] };

        if (equippedItem) {
            equippedItem = objectToNull(equippedItem);
        }

        if (inventoryItem) {
            inventoryItem = objectToNull(inventoryItem);
        }

        // Going in to hand.
        if (inventoryItem.props && inventoryItem.props.lvl) {
            const skills = JSON.parse(this.player.data.skills);
            if (inventoryItem.props.lvl.skill) {
                const skill = inventoryItem.props.lvl.skill;
                const level = getLevel(skills[skill].xp);

                if (level < inventoryItem.props.lvl.requirement) {
                    this.player.notify(
                        `You do not have level ${inventoryItem.props.lvl.requirement} ${skill}.`
                    );
                    this.player.syncInventory();
                    return;
                }
            }
        }

        this.player.equipment[equipmentIndex] = inventoryItem;
        this.player.inventory[itemIndex] = equippedItem;
        this.player.saveInventory();
    }

    unequipItem(equipmentIndex) {
        let equippedItem = { ...this.player.equipment[equipmentIndex] };

        if (equippedItem) {
            equippedItem = objectToNull(equippedItem);
        }

        if (!equippedItem) return false;

        if (
            this.player.addItem(
                equippedItem.key,
                equippedItem.quantity,
                equippedItem.props,
                false,
                false,
                equippedItem.name
            )
        ) {
            if (equippedItem.base === 'fishingrod') {
                if (this.player.job) {
                    quitJob(this.player, false, true);
                    this.player.send('You have quit fishing.');
                }
            }

            this.player.equipment[equipmentIndex] = null;
            this.player.saveInventory();
            return true;
        }

        this.player.syncInventory();
        return false;
    }

    splitItem(index) {
        if (this.player.splitting) return;
        this.player.splitting = true;

        if (!this.player.inventory[index]) {
            this.player.syncInventory();
            this.player.splitting = false;
            return false;
        }

        if (this.player.inventory[index].quantity <= 1) {
            this.player.syncInventory();
            this.player.splitting = false;
            return false;
        }

        const item = { ...this.player.inventory[index] };
        const split = Math.floor(parseInt(item.quantity) / 2);
        const remainder = parseInt(item.quantity) - split;
        let nullIndexes = 0;
        this.player.inventory.forEach(item => {
            if (!item) {
                nullIndexes += 1;
            }
        });

        if (nullIndexes <= 1) {
            this.player.notify('No room to split item.');
            this.player.splitting = false;
            return false;
        }

        this.player.inventory[index] = null;
        this.player.addItem(item.key, parseInt(split), item.props, true, true);
        this.player.addItem(item.key, parseInt(remainder), item.props, true, true);

        this.player.saveInventory();
        this.player.splitting = false;
        return true;
    }

    removeItem(index) {
        this.player.inventory[index] = null;
        this.player.saveInventory();
    }

    setWeapon(hash) {
        this.player.removeAllWeapons();
        this.player.giveWeapon(hash, 999, true);
    }

    getNullSlots() {
        let count = 0;
        this.player.inventory.forEach((item, index) => {
            if (index >= 28) return;
            if (!item) {
                count += 1;
                return;
            }
        });
        return count;
    }

    hasItem(base) {
        // Check for matching base.
        let index = this.player.inventory.findIndex(item => {
            if (item && item.base === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        // Check for matching key.
        index = this.player.inventory.findIndex(item => {
            if (item && item.key === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        index = this.player.equipment.findIndex(item => {
            if (item && item.key === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        index = this.player.equipment.findIndex(item => {
            if (item && item.base === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        return false;
    }

    addStarterItems() {
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

        this.player.equipment[7] = shirt;
        this.player.equipment[10] = pants;
        this.player.equipment[13] = shoes;

        this.player.addItem('pickaxe', 1, Items.pickaxe.props);
        this.player.addItem('hammer', 1, Items.hammer.props);
        this.player.addItem('axe', 1, Items.axe.props);
        this.player.addItem('fishingrod', 1, Items.fishingrod.props);
    }

    // =================================
    // SOUND
    playAudio(soundName) {
        alt.emitClient(this.player, 'sound:PlayAudio', soundName);
    }

    playAudio3D(target, soundName) {
        alt.emitClient(this.player, 'sound:PlayAudio3D', target, soundName);
    }

    // =================================
    // Animation
    playAnimation(dictionary, name, durationInMS, flag) {
        alt.emitClient(
            this.player,
            'animation:PlayAnimation',
            this.player,
            dictionary,
            name,
            durationInMS,
            flag
        );
    }

    // =================================
    // Vehicles
    spawnVehicles() {
        if (!this.player.vehicles) {
            this.player.vehicles = [];
            this.player.emitMeta('pedflags', true);
        }

        db.fetchAllByField('guid', this.player.data.id, 'Vehicle', vehicles => {
            if (vehicles === undefined) return;

            if (vehicles.length <= 0) return;

            vehicles.forEach(veh => {
                if (!this.player) return;
                spawnVehicle(this.player, veh);
            });
        });
    }

    hasVehicleSlot() {
        if (Array.isArray(this.player.vehicles)) {
            const vehicles = this.player.vehicles.filter(veh => veh.data);
            const extraSlots = parseInt(this.player.data.extraVehicleSlots);
            if (vehicles.length >= Config.defaultPlayerMaxVehicles + extraSlots) {
                return false;
            }
        }
        return true;
    }

    addVehicle(model, pos, rot) {
        if (Array.isArray(this.player.vehicles)) {
            const vehicles = this.player.vehicles.filter(veh => veh.data);
            const extraSlots = parseInt(this.player.data.extraVehicleSlots);
            if (vehicles.length >= Config.defaultPlayerMaxVehicles + extraSlots) {
                this.player.send(`You are not allowed to have any additional vehicles.`);
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
            guid: this.player.data.id,
            model,
            position: JSON.stringify(pos),
            rotation: JSON.stringify(rot),
            stats: null,
            customization: null
        };

        spawnVehicle(this.player, veh, true);
        db.upsertData(veh, 'Vehicle', () => {});
        return true;
    }

    deleteVehicle(id) {
        db.deleteByIds([id], 'Vehicle', res => {
            console.log(res);
        });
    }

    // =================
    //
    animatedText(text, duration) {
        alt.emitClient(this.player, 'text:Animated', text, duration);
    }

    // =================
    // Vehicle Funcs
    eject() {
        alt.emitClient(this.player, 'vehicle:Eject');
    }

    ejectSlowly() {
        alt.emitClient(this.player, 'vehicle:Eject', true);
    }

    // =================
    // Skill Funcs
    syncXP() {
        this.player.emitMeta('skills', this.player.data.skills);
    }

    // =================
    // Phone
    addContact(number) {
        let contacts = JSON.parse(this.player.data.contacts);
        if (contacts.includes(number)) {
            return false;
        }

        contacts.push(number);
        this.player.data.contacts = JSON.stringify(contacts);
        this.player.saveField(this.player.data.id, 'contacts', this.player.data.contacts);
        return true;
    }

    removeContact(number) {
        let contacts = JSON.parse(this.player.data.contacts);
        let index = contacts.findIndex(x => x === number);
        if (index <= -1) {
            return false;
        }

        contacts.splice(index, 1);
        this.player.data.contacts = JSON.stringify(contacts);
        this.player.saveField(this.player.data.id, 'contacts', this.player.data.contacts);
        return true;
    }

    hasContact(number) {
        let contacts = JSON.parse(this.player.data.contacts);
        let index = contacts.findIndex(num => num === number);
        if (index <= -1) {
            return false;
        }
        return true;
    }

    syncContacts() {
        const contacts = JSON.parse(this.player.data.contacts);
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
            this.player.emitMeta('contactList', contactList);
        } else {
            this.player.emitMeta('contactList', []);
        }
    }

    // ==============================
    // Doors
    syncDoorStates() {
        Object.keys(doorStates).forEach(state => {
            alt.emitClient(
                null,
                'door:Lock',
                doorStates[state].type,
                doorStates[state].pos,
                doorStates[state].heading
            );
        });
    }

    // =================
    // Prisoner
    setArrestTime(ms) {
        if (ms <= 0) {
            this.player.data.arrestTime = '-1';
            this.player.pos = {
                x: 441.4432067871094,
                y: -982.8604125976562,
                z: 30.68960952758789
            };
            this.player.notice('You are now a free citizen.');
        } else {
            this.player.data.arrestTime = `${Date.now() + ms}`;
        }

        this.player.saveField(
            this.player.data.id,
            'arrestTime',
            this.player.data.arrestTime
        );
        this.player.syncArrest();
    }

    syncArrest() {
        if (Date.now() < parseInt(this.player.data.arrestTime)) {
            this.player.setSyncedMeta('namecolor', '{ff8400}');
        } else {
            this.player.setSyncedMeta('namecolor', null);
        }
    }

    // ===============================
    // Bonuses / Loyalty
    addVehicleSlot(amount = 1) {
        this.player.data.extraVehicleSlots += amount;
        this.player.saveField(
            this.player.data.id,
            'extraVehicleSlots',
            this.player.data.extraVehicleSlots
        );
    }

    addHouseSlot(amount = 1) {
        this.player.data.extraHouseSlots += amount;
        this.player.saveField(
            this.player.data.id,
            'extraHouseSlots',
            this.player.data.extraHouseSlots
        );
    }

    addBusinessSlot(amount = 1) {
        this.player.data.extraBusinessSlots += amount;
        this.player.saveField(
            this.player.data.id,
            'extraBusinessSlots',
            this.player.data.extraBusinessSlots
        );
    }
}

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
