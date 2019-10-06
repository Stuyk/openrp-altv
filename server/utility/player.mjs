/* eslint-disable no-undef */
import * as alt from 'alt';
import { generateHash } from '../utility/encryption.mjs';
import { Items, BaseItems } from '../configuration/items.mjs';
import * as configurationPlayer from '../configuration/player.mjs';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsTime from '../systems/time.mjs';
import * as utilityTime from '../utility/time.mjs';
import { objectToNull } from '../utility/object.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';
import { spawnVehicle } from '../systems/vehicles.mjs';
import { appendNewVehicle } from '../systems/vehicles.mjs';

console.log('Loaded: utility->player.mjs');

// Load the database handler.
const db = new SQL();

// These are player extension functions.
// They can be called from anywhere inside of
// this resource and they're very useful for
// quickly interacting with player data.
// Keep the sectioned off; it makes it easier.
export function setupPlayerFunctions(player) {
    // ====================================
    // Set Meta for User
    player.emitMeta = (key, value) => {
        player.setMeta(key, value);
        alt.emitClient(player, 'meta:Emit', key, value);
    };

    // ====================================
    // Enable Player Saving
    player.save = () => {
        db.upsertData(player.data, 'Character', () => {});
    };

    // Save only a specific field.
    player.saveField = (id, fieldName, fieldValue) => {
        db.updatePartialData(id, { [fieldName]: fieldValue }, 'Character', () => {});
    };

    // ====================================
    // Playing Time
    player.updatePlayingTime = () => {
        const minutes = utilityTime.getPlayingTime(player.startTime, Date.now());
        player.data.playingtime += Math.round(minutes);

        if (minutes >= 0)
            player.saveField(player.data.id, 'playingtime', player.data.playingtime);

        player.startTime = Date.now();

        const points = utilityTime.minutesToUpgradePoints(player.data.playingtime);
        if (points <= 0) return;

        player.data.upgradestotal = points;
        player.saveField(player.data.id, 'upgradestotal', player.data.upgradestotal);
    };

    player.setLastLogin = () => {
        const date = new Date(player.data.lastlogin * 1).toString();
        player.send(`{FFFF00}Last Login: ${date}`);
        player.data.lastlogin = Date.now();
        player.saveField(player.data.id, 'lastlogin', player.data.lastlogin);
    };

    // ====================================
    // Chat
    player.send = msg => {
        alt.emitClient(player, 'chat:Send', msg);
    };

    // ====================================
    // Weather & Time
    player.updateTime = () => {
        systemsTime.setTimeForNewPlayer(player);
    };

    // ====================================
    // Save Last Location
    player.saveLocation = pos => {
        player.data.lastposition = pos;
        player.saveField(player.data.id, 'lastposition', JSON.stringify(pos));
    };

    player.saveDead = value => {
        player.data.dead = value;

        if (!value) {
            player.saveField(player.data.id, 'health', 200);
            player.saveField(player.data.id, 'armour', 0);
        }

        player.saveField(player.data.id, 'dead', value);
    };

    player.saveData = () => {
        player.data.health = player.health;
        player.data.armour = player.armour;
        player.data.lastposition = JSON.stringify(player.pos);
        player.save();
    };

    // ====================================
    // Sync Interaction Blips
    player.syncInteractionBlips = () => {
        systemsInteraction.syncBlips(player);
    };

    // ====================================
    // Registration Webview Related Events
    player.showRegisterDialogue = (regCamCoord, regCamPointAtCoord) => {
        alt.emitClient(player, 'register:ShowDialogue', regCamCoord, regCamPointAtCoord);
    };

    // Clear player blood
    player.clearBlood = () => {
        alt.emitClient(player, 'respawn:ClearPedBloodDamage');
    };

    // Show Error Message
    player.showRegisterEventError = msg => {
        alt.emitClient(player, 'register:EmitEventError', msg);
    };

    // Show Success Message
    player.showRegisterEventSuccess = msg => {
        alt.emitClient(player, 'register:EmitEventSuccess', msg);
    };

    // Show Success Message
    player.showRegisterLogin = () => {
        alt.emitClient(player, 'register:ShowLogin');
    };

    // Close Dialogue
    player.closeRegisterDialogue = () => {
        alt.emitClient(player, 'register:CloseDialogue');
    };

    // ====================================
    // Screen Effects
    player.screenFadeOutFadeIn = (fadeInOutMS, timeoutMS) => {
        alt.emitClient(player, 'screen:FadeOutFadeIn', fadeInOutMS, timeoutMS);
    };

    player.screenFadeOut = timeInMS => {
        alt.emitClient(player, 'screen:FadeOut', timeInMS);
    };

    player.screenFadeIn = timeInMS => {
        alt.emitClient(player, 'screen:FadeIn', timeInMS);
    };

    player.screenBlurOut = timeInMS => {
        alt.emitClient(player, 'screen:BlurOut', timeInMS);
    };

    player.screenBlurIn = timeInMS => {
        alt.emitClient(player, 'screen:BlurIn', timeInMS);
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
        name = undefined
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

        console.log(`Total: ${total}`);

        if (total < quantity) {
            return false;
        }
        return true;
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
                    if (item.name === '') {
                        item = null;
                    } else {
                        item = objectToNull(item);
                    }
                }
            });
            player.data.inventory = JSON.stringify(inventory);
        }

        player.equipment = JSON.parse(player.data.equipment);
        player.inventory = JSON.parse(player.data.inventory);

        player.emitMeta('equipment', player.data.equipment);
        player.emitMeta('inventory', player.data.inventory);

        if (player.equipment[11]) {
            if (player.equipment[11].base === 'weapon') {
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
            player.equipment[equipmentIndex] = null;
            player.saveInventory();
            return true;
        }

        player.syncInventory();
        return false;
    };

    player.swapItems = (heldIndex, dropIndex) => {
        let heldItem = { ...player.inventory[heldIndex] };
        let dropItem = { ...player.inventory[dropIndex] };
        if (heldIndex === dropIndex) return;

        if (heldItem) {
            heldItem = objectToNull(heldItem);
        }

        if (dropItem) {
            dropItem = objectToNull(dropItem);
        }

        if (heldItem && dropItem) {
            const heldBase = BaseItems[heldItem.base];
            if (heldItem.name === dropItem.name && heldBase.abilities.stack) {
                player.inventory[dropIndex].quantity += parseInt(heldItem.quantity);
                player.inventory[heldIndex] = null;
                player.saveInventory();
                return;
            }
        }

        player.inventory[heldIndex] = dropItem;
        player.inventory[dropIndex] = heldItem;
        player.saveInventory();
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
        const nullIndexes = player.inventory.filter(item => !item);
        if (nullIndexes.length <= 1) {
            player.send('{FF0000} No room for item split.');
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
        /*
        let shirt = { ...configurationItems.Items.Shirt };
        shirt.props = {
            description: 'Starter Shirt',
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

        let pants = { ...configurationItems.Items.Pants };
        pants.props = {
            description: 'Starter Pants',
            restriction: -1,
            female: [{ id: 4, value: 0, texture: 2 }],
            male: [{ id: 4, value: 0, texture: 0 }]
        };

        let shoes = { ...configurationItems.Items.Shoes };
        shoes.props = {
            description: 'Starter Pants',
            restriction: -1,
            female: [{ id: 6, value: 3, texture: 0 }],
            male: [{ id: 6, value: 1, texture: 0 }]
        };

        player.addItem(shirt, 1);
        player.addItem(pants, 1);
        player.addItem(shoes, 1);
        */
    };

    // =================================
    // SOUND
    player.playAudio = soundName => {
        alt.emitClient(player, 'sound:PlayAudio', soundName);
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

    player.addVehicle = (model, pos, rot) => {
        if (Array.isArray(player.vehicles)) {
            if (
                player.vehicles.length >= configurationPlayer.PlayerDefaults.maxvehicles
            ) {
                player.send(`You are not allowed to have any additional vehicles.`);
                return;
            }
        }

        const veh = {
            guid: player.data.id,
            model,
            position: JSON.stringify(pos),
            rotation: JSON.stringify(rot),
            stats: null,
            customization: null
        };
        const spawnedVehicle = spawnVehicle(player, veh, true);
        db.insertData(
            {
                guid: player.data.id,
                position: JSON.stringify(pos),
                rotation: JSON.stringify(rot),
                model
            },
            'Vehicle',
            newVehicle => {
                appendNewVehicle(newVehicle.identifiers[0].id, spawnedVehicle);
            }
        );
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
        let index = contacts.findIndex(x => x === number);
        if (index <= -1) {
            return false;
        }
        return true;
    };
}
