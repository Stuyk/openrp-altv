/* eslint-disable no-undef */
import * as alt from 'alt';
import { generateHash } from '../utility/encryption.mjs';
import { Items, BaseItems } from '../configuration/items.mjs';
import { Config } from '../configuration/config.mjs';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsTime from '../systems/time.mjs';
import * as utilityTime from '../utility/time.mjs';
import { objectToNull } from '../utility/object.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';
import { spawnVehicle } from '../systems/vehicles.mjs';
import { quitJob } from '../systems/job.mjs';
import { fetchNextVehicleID, getCharacterName, modifyRank } from '../cache/cache.mjs';
import { dropNewItem } from '../systems/inventory.mjs';
import { doorStates } from '../systems/use.mjs';
import { getGang } from '../systems/gangs.mjs';

// Load the database handler.
const db = new SQL();

export function setupPlayerFunctions(player) {
    /**
     * setupPlayerFunctions
     * @exports setupPlayerfunctions
     * @namespace player
     */

    /**
     *  Used to emit meta to the local player and server.
     *  Can be fetched on the client side by doing getMeta.
     * @memberof player
     * @param {any} key
     * @param {any} value
     */
    player.emitMeta = (key, value) => {
        player.setMeta(key, value);
        alt.emitClient(player, 'meta:Emit', key, value);
    };

    /**
     *  Used to save all `player.data` information.
     * @memberof player
     */
    player.save = () => {
        db.upsertData(player.data, 'Character', () => {});
    };

    /**
     *  Used to save a specific id, field, and value.
     * @memberof player
     * @param {string/number} id User's database id. ie. player.data.id
     * @param {string} fieldName The field name to use.
     * @param {any} fieldValue The field value to apply.
     */
    player.saveField = (id, fieldName, fieldValue) => {
        db.updatePartialData(id, { [fieldName]: fieldValue }, 'Character', () => {});
    };

    player.setRank = flags => {
        modifyRank(player.pgid, flags);
        db.updatePartialData(player.pgid, { rank: flags }, 'Account', () => {
            alt.log(`Updated ${player.pgid} to rank ${flags}`);
        });
    };

    /**
     * Updates the player's current playing time.
     * Calculated from start time; until now. Then resets it.
     * @memberof player
     */
    player.updatePlayingTime = () => {
        console.log('Updating Playing Time');
        if (!player.startTime) {
            player.startTime = Date.now();
            return;
        }

        const minutesPlayed = utilityTime.getPlayingTime(player.startTime, Date.now());
        player.data.playingtime += parseInt(Math.round(minutesPlayed));
        let isAboveThreshold = minutesPlayed >= 1 ? true : false;
        player.startTime = Date.now();

        if (isAboveThreshold) {
            const points = utilityTime.minutesToUpgradePoints(player.data.playingtime);
            player.data.upgradestotal = points;

            // db.updatePartialData(id, { [fieldName]: fieldValue }, 'Character', () => {});
            db.updatePartialData(
                player.data.id,
                {
                    playingtime: player.data.playingtime,
                    upgradestotal: player.data.upgradestotal
                },
                'Character',
                () => {}
            );
        }
    };

    /**
     *  Set the last login date of the user to the database.
     * @memberof player
     */
    player.setLastLogin = () => {
        const date = new Date(player.data.lastlogin * 1).toString();
        player.send(`{FFFF00}Last Login: ${date}`);
        player.data.lastlogin = Date.now();
        player.saveField(player.data.id, 'lastlogin', player.data.lastlogin);
    };

    /**
     *  Send a message to the player.
     * @memberof player
     * @param {string} msg The message to send to the user.
     */
    player.send = msg => {
        alt.emitClient(player, 'chat:Send', msg);
    };

    /**
     *  Display a message in the center screen to the user.
     * @memberof player
     * @param {string} msg The message to send to the user.
     */
    player.notice = msg => {
        player.emitMeta('hudNotice', msg);
    };

    /**
     *  Display a notification on the right-hand side.
     * @memberof player
     * @param {string} msg The message to send to the user.
     */
    player.notify = msg => {
        player.emitMeta('queueNotification', msg);
    };

    player.saveDimension = number => {
        player.data.dimension = number;
        player.saveField(player.data.id, 'dimension', number);
    };

    // ====================================
    // Weather & Time
    player.updateTime = () => {
        systemsTime.updatePlayerTime(player);
    };

    /**
     *  Save the user's location.
     * @memberof player
     * @param {Vector3} pos A vector3 object.
     */
    player.saveLocation = pos => {
        player.data.lastposition = pos;
        player.saveField(player.data.id, 'lastposition', JSON.stringify(pos));
    };

    /**
     *  Save the player's dead state.
     * @memberof player
     * @param {bool} value isPlayerDead?
     */
    player.saveDead = value => {
        player.data.dead = value;

        if (!value) {
            player.saveField(player.data.id, 'health', 200);
            player.saveField(player.data.id, 'armour', 0);
        }

        player.saveField(player.data.id, 'dead', value);
    };

    /**
     *  Save Common Data; health, armour, position.
     * @memberof player
     */
    player.saveData = () => {
        player.data.health = player.health;
        player.data.armour = player.armour;
        player.data.lastposition = JSON.stringify(player.pos);
        player.save();
    };

    /**
     *  Synchronize interaction blips for the interaction system.
     * @memberof player
     */
    player.syncInteractionBlips = () => {
        systemsInteraction.syncBlips(player);
    };

    /**
     *  Remove pedestrian blood.
     * @memberof player
     */
    player.clearBlood = () => {
        alt.emitClient(player, 'respawn:ClearPedBloodDamage');
    };

    /**
     *  Fade the screen in and out over a period of time.
     * @memberof player
     * @param {number} fadeInOutMS Fade out for how long.
     * @param {number} timeoutMS Fade in after this time.
     */
    player.screenFadeOutFadeIn = (fadeInOutMS, timeoutMS) => {
        alt.emitClient(player, 'screen:FadeOutFadeIn', fadeInOutMS, timeoutMS);
    };

    /**
     *  Fade the screen out.
     * @memberof player
     * @param {number} timeInMS How long to fade the screen out for.
     */
    player.screenFadeOut = timeInMS => {
        alt.emitClient(player, 'screen:FadeOut', timeInMS);
    };

    /**
     *  Fade the screen in.
     * @memberof player
     * @param {number} timeInMS How long to fade the screen in.
     */
    player.screenFadeIn = timeInMS => {
        alt.emitClient(player, 'screen:FadeIn', timeInMS);
    };

    /**
     *  Blur the screen.
     * @memberof player
     * @param {number} timeInMS How long it takes to blur the screen.
     */
    player.screenBlurOut = timeInMS => {
        alt.emitClient(player, 'screen:BlurOut', timeInMS);
    };

    /**
     *  Unblur the screen.
     * @memberof player
     * @param {number} timeInMS How long to unblur the screen.
     */
    player.screenBlurIn = timeInMS => {
        alt.emitClient(player, 'screen:BlurIn', timeInMS);
    };

    /**
     *  Revive the player.
     * @memberof player
     */
    player.revive = () => {
        player.screenFadeOutFadeIn(1000, 5000);

        if (!player.revivePos) {
            player.spawn(player.pos.x, player.pos.y, player.pos.z, 2000);
        } else {
            player.spawn(
                player.revivePos.x,
                player.revivePos.y,
                player.revivePos.z,
                2000
            );
        }

        player.clearBlood();
        player.setHealth(200);
        player.setArmour(0);
        player.revivePos = undefined;
        player.reviveTime = undefined;
        player.reviving = false;
        player.isArrested = false;
        player.lastLocation = undefined;
        player.sendToJail = false;
        player.saveDead(false);
        player.taxIncome(Config.hospitalPctFee, true, 'Hospital Fee');
        player.send('You have been revived.');
        player.setSyncedMeta('dead', false);
    };

    /**
     * Set the user's health.
     * @memberof player
     * @param {number} amount The amount to set the user's health.
     */
    player.setHealth = amount => {
        player.health = amount;
        player.data.health = amount;
        player.lastHealth = player.health;
    };

    /**
     *  Set the user's armour.
     * @memberof player
     * @param {number} amount The amount to set the user's armour.
     */
    player.setArmour = amount => {
        player.armour = amount;
        player.data.armour = amount;
        player.lastArmour = player.armour;
    };

    // ====================================
    // Face Customizer
    player.showFaceCustomizerDialogue = location => {
        if (location !== undefined) {
            player.lastLocation = location;
        } else {
            player.lastLocation = player.pos;
        }

        alt.emitClient(player, 'face:ShowDialogue');
    };

    player.applyFace = valueJSON => {
        const data = JSON.parse(valueJSON);

        if (data.Sex.value === 0) {
            player.model = 'mp_f_freemode_01';
        } else {
            player.model = 'mp_m_freemode_01';
        }

        player.emitMeta('face', valueJSON);
    };

    player.saveFace = (valueJSON, isBarbershop) => {
        const data = JSON.parse(valueJSON);

        if (!isBarbershop) {
            player.model = data.Sex.value === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
            if (player.isNewPlayer) {
                player.addStarterItems();
                player.isNewPlayer = false;
            }
        }

        player.data.face = valueJSON;
        player.saveField(player.data.id, 'face', valueJSON);
        player.emitMeta('face', valueJSON);
        player.syncInventory(true);
    };

    // ====================================
    // Roleplay Name Dialogues
    player.showRoleplayInfoDialogue = () => {
        alt.emitClient(player, 'roleplayinfo:ShowDialogue');
    };

    player.closeRoleplayInfoDialogue = () => {
        alt.emitClient(player, 'roleplayinfo:CloseDialogue');
    };

    // ====================================
    // Money Functions
    // Remove cash from the player.
    player.syncMoney = () => {
        player.emitMeta('bank', player.data.bank);
        player.emitMeta('cash', player.data.cash);
    };

    player.subCash = value => {
        let absValue = Math.abs(parseFloat(value)) * 1;

        if (player.data.cash < absValue) return false;

        player.data.cash -= absValue;
        player.data.cash = Number.parseFloat(player.data.cash).toFixed(2) * 1;
        player.saveField(player.data.id, 'cash', player.data.cash);
        player.syncMoney();
        return true;
    };

    // Add cash to the player.
    player.addCash = value => {
        let absValue = Math.abs(parseFloat(value));

        if (player.data.cash + absValue > 92233720368547758.07) {
            absValue = 0;
        }

        player.data.cash += absValue;
        player.data.cash = Number.parseFloat(player.data.cash).toFixed(2) * 1;
        player.saveField(player.data.id, 'cash', player.data.cash);
        player.syncMoney();
        return true;
    };

    // Add cash to the bank.
    player.addBank = value => {
        let absValue = Math.abs(parseFloat(value));

        if (player.data.bank + absValue > 92233720368547758.07) {
            absValue = 0;
        }

        player.data.bank += absValue;
        player.data.bank = Number.parseFloat(player.data.bank).toFixed(2) * 1;
        player.saveField(player.data.id, 'bank', player.data.bank);
        player.syncMoney();
        return true;
    };

    // Subtract the cash from the bank.
    player.subBank = value => {
        let absValue = Math.abs(parseFloat(value)) * 1;

        if (player.data.bank < absValue) return false;

        player.data.bank -= absValue;
        player.data.bank = Number.parseFloat(player.data.bank).toFixed(2) * 1;
        player.saveField(player.data.id, 'bank', player.data.bank);
        player.syncMoney();
        return true;
    };

    // Get the player's cash balance.
    player.getCash = () => {
        return player.data.cash;
    };

    // Get the player's bank balance.
    player.getBank = () => {
        return player.data.bank;
    };

    player.subToZero = amount => {
        const bank = player.data.bank;
        const cash = player.data.cash;
        const removed = Math.abs(bank - amount);
        player.data.bank = bank - amount <= 0 ? 0 : bank - amount;

        if (removed > 0) {
            player.data.cash = cash - removed <= 0 ? 0 : cash - removed;
        }

        player.saveField(player.data.id, 'bank', player.data.bank);
        player.saveField(player.data.id, 'cash', player.data.cash);
        player.syncMoney();
    };

    player.taxIncome = (percentage, useHighest, reason) => {
        let cash = player.getCash(); // 0
        let bank = player.getBank(); // 1

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
            player.subCash(cashTaxAmount);
            player.send(`You were taxed: $${cashTaxAmount.toFixed(2) * 1}`);
        } else {
            let bankTaxAmount = bank * percentage;
            player.subBank(bankTaxAmount);
            player.saveField(player.data.id, 'bank', player.data.bank);
            player.send(`You were taxed: $${bankTaxAmount.toFixed(2) * 1}`);
        }

        player.send(`Reason: ${reason}`);
    };

    // ====================================
    // Load Blip for client.
    player.createBlip = (pos, blipType, blipColor, labelName) => {
        alt.emitClient(player, 'blip:CreateBlip', pos, blipType, blipColor, labelName);
    };

    // ====================================
    // Show the ATM Panel / Dialogue
    player.showAtmPanel = () => {
        alt.emitClient(player, 'atm:ShowDialogue');
    };

    // Close the ATM Panel / Dialogue
    player.closeAtmPanel = () => {
        alt.emitClient(player, 'atm:CloseDialogue');
    };

    // Update the ATM Cash balance the user sees.
    player.updateAtmCash = value => {
        alt.emitClient(player, 'atm:UpdateCash', value);
    };

    // Update the ATM Bank balance the user sees.
    player.updateAtmBank = value => {
        alt.emitClient(player, 'atm:UpdateBank', value);
    };

    // Show the ATM success message.
    player.showAtmSuccess = msg => {
        alt.emitClient(player, 'atm:ShowSuccess', msg);
    };

    // =================================
    /**
     * Show the Clothing Dialogue
     */
    player.showClothingDialogue = () => {
        alt.emitClient(player, 'clothing:ShowDialogue');
    };

    /**
     * Close the clothing Dialogue.
     */
    player.closeClothingDialogue = () => {
        alt.emitClient(player, 'clothing:CloseDialogue');
    };

    // =================================
    /**
     * Set / Save the player's Roleplay Info
     */
    player.saveRoleplayInfo = value => {
        player.data.name = value.name;
        player.data.dob = `${value.dob}`;
        player.setSyncedMeta('name', player.data.name);
        player.setSyncedMeta('dob', player.data.dob);
        player.saveField(player.data.id, 'name', player.data.name);
        player.saveField(player.data.id, 'dob', player.data.dob);
    };

    // =================================
    // INVENTORY
    // Add an item to a player.
    player.addItem = (
        key,
        quantity,
        props = {},
        skipStackable = false,
        skipSave = false,
        name = undefined,
        icon = undefined
    ) => {
        const item = Items[key];
        const base = BaseItems[Items[key].base];

        if (!item) {
            console.log('Item does not exist.');
            return false;
        }

        if (!base) {
            console.log('Base item does not exist.');
            return false;
        }

        const clonedItem = { ...item };
        if (name) {
            clonedItem.name = name;
        }

        if (!skipStackable) {
            const inventoryIndex = player.inventory.findIndex(item => {
                if (item && item.key === clonedItem.key) return item;
            });

            if (base.abilities.stack && inventoryIndex >= 0) {
                player.inventory[inventoryIndex].quantity += quantity;
                player.saveInventory();
                return true;
            }
        }

        clonedItem.props = props;
        clonedItem.quantity = quantity;
        clonedItem.hash = generateHash(JSON.stringify(clonedItem));
        if (icon) {
            clonedItem.icon = icon;
        }

        const nullIndex = player.inventory.findIndex(item => !item);
        if (nullIndex >= 28) {
            player.send('{FF0000} No room for item in inventory.');
            return false;
        }

        player.inventory[nullIndex] = clonedItem;

        if (!skipSave) {
            player.saveInventory();
        }
        return true;
    };

    // Remove an Item from the Player
    // Finds all matching items; adds up quantities.
    // Loops through each found item and removes quantity
    // when quantity is zero; it stops removing.
    // This allows for split stacks.
    player.subItem = (key, quantity) => {
        const indexes = [];
        const entries = player.inventory.entries();
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
            total += parseInt(player.inventory[currIndex].quantity);
        });

        if (total < quantity) {
            return false;
        }

        indexes.forEach(currIndex => {
            if (quantity === 0) return;
            if (player.inventory[currIndex].quantity < quantity) {
                const currQuantity = parseInt(player.inventory[currIndex].quantity);
                player.inventory[currIndex].quantity -= parseInt(currQuantity);
                quantity -= parseInt(currQuantity);
            } else {
                player.inventory[currIndex].quantity -= parseInt(quantity);
                quantity -= parseInt(quantity);
            }

            if (player.inventory[currIndex].quantity <= 0) {
                player.inventory[currIndex] = null;
            }
        });

        player.saveInventory();
        return true;
    };

    player.subItemByHash = hash => {
        const index = player.inventory.findIndex(item => item && item.hash === hash);
        if (index <= -1) return false;
        player.inventory[index] = null;
        player.saveInventory();
        return true;
    };

    player.hasQuantityOfItem = (key, quantity) => {
        const indexes = [];
        const entries = player.inventory.entries();
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
            total += parseInt(player.inventory[currIndex].quantity);
        });

        if (total < quantity) {
            return false;
        }
        return true;
    };

    player.removeItemsOnArrest = () => {
        const illegalBaseItems = ['weapon', 'boundweapon', 'unrefined', 'refineddrug'];

        player.inventory.forEach((item, index) => {
            if (!item) return;
            if (illegalBaseItems.includes(item.base)) {
                player.inventory[index] = null;
            }
        });

        player.equipment.forEach((item, index) => {
            if (!item) return;
            if (illegalBaseItems.includes(item.base)) {
                player.equipment[index] = null;
            }
        });

        player.saveInventory();
    };

    player.dropItemsOnDeath = () => {
        if (!player.inventory) return;
        player.inventory.forEach((item, index) => {
            if (!item) return;
            if (item.base.includes('weapon') || item.base.includes('unrefined')) {
                const itemClone = { ...item };
                dropNewItem(player.pos, itemClone);
                player.inventory[index] = null;
            }
        });
        player.saveInventory();
    };

    player.saveInventory = () => {
        player.data.inventory = JSON.stringify(player.inventory);
        player.data.equipment = JSON.stringify(player.equipment);
        player.saveField(player.data.id, 'inventory', player.data.inventory);
        player.saveField(player.data.id, 'equipment', player.data.equipment);
        player.syncInventory(true);
    };

    player.syncInventory = (cleanse = false) => {
        if (cleanse) {
            const inventory = JSON.parse(player.data.inventory);
            inventory.forEach(item => {
                if (item) {
                    item = objectToNull(item);
                }
            });
            player.data.inventory = JSON.stringify(inventory);
        }

        player.equipment = JSON.parse(player.data.equipment);
        player.inventory = JSON.parse(player.data.inventory);

        player.emitMeta('equipment', player.data.equipment);
        player.emitMeta('inventory', player.data.inventory);

        if (player.equipment[11]) {
            if (
                player.equipment[11].base === 'weapon' ||
                player.equipment[11].base === 'boundweapon'
            ) {
                player.setSyncedMeta('prop:11', undefined);
                player.setWeapon(player.equipment[11].props.hash);
            } else {
                player.removeAllWeapons();
                player.setSyncedMeta('prop:11', player.equipment[11].props.propData);
            }
        } else {
            player.setSyncedMeta('prop:11', undefined);
            player.removeAllWeapons();
        }
    };

    player.searchItems = () => {
        let hasDrugs = false;
        let hasWeapons = false;

        player.inventory.forEach(item => {
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

    player.equipItem = (itemIndex, equipmentIndex) => {
        let equippedItem = { ...player.equipment[equipmentIndex] };
        let inventoryItem = { ...player.inventory[itemIndex] };

        if (equippedItem) {
            equippedItem = objectToNull(equippedItem);
        }

        if (inventoryItem) {
            inventoryItem = objectToNull(inventoryItem);
        }

        player.equipment[equipmentIndex] = inventoryItem;
        player.inventory[itemIndex] = equippedItem;
        player.saveInventory();
    };

    player.unequipItem = equipmentIndex => {
        let equippedItem = { ...player.equipment[equipmentIndex] };

        if (equippedItem) {
            equippedItem = objectToNull(equippedItem);
        }

        if (!equippedItem) return false;

        if (
            player.addItem(
                equippedItem.key,
                1,
                equippedItem.props,
                false,
                false,
                equippedItem.name
            )
        ) {
            if (equippedItem.base === 'fishingrod') {
                if (player.job) {
                    quitJob(player, false, true);
                    player.send('You have quit fishing.');
                }
            }

            player.equipment[equipmentIndex] = null;
            player.saveInventory();
            return true;
        }

        player.syncInventory();
        return false;
    };

    player.splitItem = index => {
        if (player.splitting) return;
        player.splitting = true;

        if (!player.inventory[index]) {
            player.syncInventory();
            player.splitting = false;
            return false;
        }

        if (player.inventory[index].quantity <= 1) {
            player.syncInventory();
            player.splitting = false;
            return false;
        }

        const item = { ...player.inventory[index] };
        const split = Math.floor(parseInt(item.quantity) / 2);
        const remainder = parseInt(item.quantity) - split;
        let nullIndexes = 0;
        player.inventory.forEach(item => {
            if (!item) {
                nullIndexes += 1;
            }
        });

        if (nullIndexes <= 1) {
            player.notify('No room to split item.');
            player.splitting = false;
            return false;
        }

        player.inventory[index] = null;
        player.addItem(item.key, parseInt(split), item.props, true, true);
        player.addItem(item.key, parseInt(remainder), item.props, true, true);

        player.saveInventory();
        player.splitting = false;
        return true;
    };

    player.removeItem = index => {
        player.inventory[index] = null;
        player.saveInventory();
    };

    player.setWeapon = hash => {
        player.removeAllWeapons();
        player.giveWeapon(hash, 999, true);
    };

    player.getNullSlots = () => {
        const nullSlots = player.inventory.filter(item => !item);
        return nullSlots.length;
    };

    player.hasItem = base => {
        // Check for matching base.
        let index = player.inventory.findIndex(item => {
            if (item && item.base === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        // Check for matching key.
        index = player.inventory.findIndex(item => {
            if (item && item.key === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        index = player.equipment.findIndex(item => {
            if (item && item.key === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        index = player.equipment.findIndex(item => {
            if (item && item.base === base) return item;
        });

        if (index !== -1) {
            return true;
        }

        return false;
    };

    player.addStarterItems = () => {
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

        player.equipment[7] = shirt;
        player.equipment[10] = pants;
        player.equipment[13] = shoes;

        player.addItem('pickaxe1', 1, Items.pickaxe1.props);
        player.addItem('hammer1', 1, Items.hammer1.props);
        player.addItem('axe1', 1, Items.axe1.props);
        player.addItem('fishingrod1', 1, Items.fishingrod1.props);
    };

    // =================================
    // SOUND
    player.playAudio = soundName => {
        alt.emitClient(player, 'sound:PlayAudio', soundName);
    };

    player.playAudio3D = (target, soundName) => {
        alt.emitClient(player, 'sound:PlayAudio3D', target, soundName);
    };

    // =================================
    // Animation
    player.playAnimation = (dictionary, name, durationInMS, flag) => {
        alt.emitClient(
            player,
            'animation:PlayAnimation',
            player,
            dictionary,
            name,
            durationInMS,
            flag
        );
    };

    // =================================
    // Vehicles
    player.spawnVehicles = () => {
        if (!player.vehicles) {
            player.vehicles = [];
            player.emitMeta('pedflags', true);
        }

        db.fetchAllByField('guid', player.data.id, 'Vehicle', vehicles => {
            if (vehicles === undefined) return;

            if (vehicles.length <= 0) return;

            vehicles.forEach(veh => {
                if (!player) return;
                spawnVehicle(player, veh);
            });
        });
    };

    player.hasVehicleSlot = () => {
        if (Array.isArray(player.vehicles)) {
            const vehicles = player.vehicles.filter(veh => veh.data);
            const extraSlots = parseInt(player.data.extraVehicleSlots);
            if (vehicles.length >= Config.defaultPlayerMaxVehicles + extraSlots) {
                return false;
            }
        }
        return true;
    };

    player.addVehicle = (model, pos, rot) => {
        if (Array.isArray(player.vehicles)) {
            const vehicles = player.vehicles.filter(veh => veh.data);
            const extraSlots = parseInt(player.data.extraVehicleSlots);
            if (vehicles.length >= Config.defaultPlayerMaxVehicles + extraSlots) {
                player.send(`You are not allowed to have any additional vehicles.`);
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
            guid: player.data.id,
            model,
            position: JSON.stringify(pos),
            rotation: JSON.stringify(rot),
            stats: null,
            customization: null
        };

        spawnVehicle(player, veh, true);
        db.upsertData(veh, 'Vehicle', () => {});
        return true;
    };

    player.deleteVehicle = id => {
        db.deleteByIds([id], 'Vehicle', res => {
            console.log(res);
        });
    };

    // =================
    //
    player.animatedText = (text, duration) => {
        alt.emitClient(player, 'text:Animated', text, duration);
    };

    // =================
    // Vehicle Funcs
    player.eject = () => {
        alt.emitClient(player, 'vehicle:Eject');
    };

    player.ejectSlowly = () => {
        alt.emitClient(player, 'vehicle:Eject', true);
    };

    // =================
    // Skill Funcs
    player.syncXP = () => {
        player.emitMeta('skills', player.data.skills);
    };

    // =================
    // Phone
    player.addContact = number => {
        let contacts = JSON.parse(player.data.contacts);
        if (contacts.includes(number)) {
            return false;
        }

        contacts.push(number);
        player.data.contacts = JSON.stringify(contacts);
        player.saveField(player.data.id, 'contacts', player.data.contacts);
        return true;
    };

    player.removeContact = number => {
        let contacts = JSON.parse(player.data.contacts);
        let index = contacts.findIndex(x => x === number);
        if (index <= -1) {
            return false;
        }

        contacts.splice(index, 1);
        player.data.contacts = JSON.stringify(contacts);
        player.saveField(player.data.id, 'contacts', player.data.contacts);
        return true;
    };

    player.hasContact = number => {
        let contacts = JSON.parse(player.data.contacts);
        let index = contacts.findIndex(num => num === number);
        if (index <= -1) {
            return false;
        }
        return true;
    };

    player.syncContacts = () => {
        const contacts = JSON.parse(player.data.contacts);
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
            player.emitMeta('contactList', contactList);
        } else {
            player.emitMeta('contactList', []);
        }
    };

    // ==============================
    // Doors
    player.syncDoorStates = () => {
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
    player.setArrestTime = ms => {
        if (ms <= 0) {
            player.data.arrestTime = '-1';
            player.pos = {
                x: 441.4432067871094,
                y: -982.8604125976562,
                z: 30.68960952758789
            };
            player.notice('You are now a free citizen.');
        } else {
            player.data.arrestTime = `${Date.now() + ms}`;
        }

        player.saveField(player.data.id, 'arrestTime', player.data.arrestTime);
        player.syncArrest();
    };

    player.syncArrest = () => {
        if (Date.now() < parseInt(player.data.arrestTime)) {
            player.setSyncedMeta('namecolor', '{ff8400}');
        } else {
            player.setSyncedMeta('namecolor', null);
        }
    };

    // ===============================
    // Bonuses / Loyalty
    player.addVehicleSlot = (amount = 1) => {
        player.data.extraVehicleSlots += amount;
        player.saveField(
            player.data.id,
            'extraVehicleSlots',
            player.data.extraVehicleSlots
        );
    };

    player.addHouseSlot = (amount = 1) => {
        player.data.extraHouseSlots += amount;
        player.saveField(player.data.id, 'extraHouseSlots', player.data.extraHouseSlots);
    };

    player.addBusinessSlot = (amount = 1) => {
        player.data.extraBusinessSlots += amount;
        player.saveField(
            player.data.id,
            'extraBusinessSlots',
            player.data.extraBusinessSlots
        );
    };
    // =============================
    player.syncGang = () => {
        player.emitMeta('gang:ID', player.data.gang);

        if (player.data.gang !== -1) {
            const info = getGang(player);
            if (info === undefined || info === null) {
                player.saveField(player.data.id, 'gang', -1);
                player.emitMeta('gang:Info', null);
                return;
            }

            player.emitMeta('gang:Info', JSON.stringify(info));
        } else {
            player.emitMeta('gang:Info', null);
        }
    };

    player.saveGangID = () => {
        player.saveField(player.data.id, 'gang', player.data.gang);
    };
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
