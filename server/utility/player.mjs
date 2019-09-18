/* eslint-disable no-undef */
import * as alt from 'alt';
import * as utilityEncryption from '../utility/encryption.mjs';
import * as configurationItems from '../configuration/items.mjs';
import * as configurationPlayer from '../configuration/player.mjs';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsTime from '../systems/time.mjs';
import * as utilityTime from '../utility/time.mjs';
import SQL from '../../../postgres-wrapper/database.mjs';

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
        player.saveField(player.data.id, 'dead', value);
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

        if (data['Sex'].value === 0) {
            player.model = 'mp_f_freemode_01';
        } else {
            player.model = 'mp_m_freemode_01';
        }

        player.emitMeta('face', valueJSON);
    };

    player.saveFace = (valueJSON, isBarbershop) => {
        const data = JSON.parse(valueJSON);

        if (!isBarbershop) {
            if (data['Sex'].value === 0) {
                player.model = 'mp_f_freemode_01';
                if (player.isNewPlayer) {
                    player.addStarterItems();
                    player.isNewPlayer = false;
                }
            } else {
                player.model = 'mp_m_freemode_01';
                if (player.isNewPlayer) {
                    player.addStarterItems();
                    player.isNewPlayer = false;
                }
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
        player.data.dob = value.dob;
        player.setSyncedMeta('name', player.data.name);
        player.setSyncedMeta('dob', player.data.dob);
        player.saveField(player.data.id, 'name', player.data.name);
        player.saveField(player.data.id, 'dob', player.data.dob);
    };

    // =================================
    // INVENTORY
    // Add an item to a player.
    player.syncInventory = (cleanse = false) => {
        if (cleanse) {
            const inventory = JSON.parse(player.data.inventory);
            inventory.forEach(item => {
                if (!item) {
                    item = null;
                    return;
                }

                if (item.constructor === Object && Object.entries(item).length <= 0) {
                    item = null;
                    return;
                }
            });
            player.data.inventory = JSON.stringify(inventory);
        }

        player.inventory = JSON.parse(player.data.inventory);
        player.emitMeta('inventory', player.data.inventory);
    };

    player.addItem = (itemTemplate, quantity, isUnique = false) => {
        let itemClone = {
            label: itemTemplate.label,
            quantity: 0,
            props: itemTemplate.props,
            slot: itemTemplate.slot,
            rename: itemTemplate.rename,
            useitem: itemTemplate.useitem,
            consumeable: itemTemplate.consumeable,
            droppable: itemTemplate.droppable,
            icon: itemTemplate.icon,
            isWeapon: itemTemplate.isWeapon
        };

        // If the item is stackable; check if the player has it.
        if (itemTemplate.stackable && !isUnique) {
            // Find stackable item index.
            let index = player.inventory.findIndex(
                x => x !== null && x !== undefined && x.label === itemClone.label
            );

            // The item exists.
            if (index > -1) {
                alt.emit('inventory:AddItem', player, index, quantity);
                return true;
            }
        }

        // This is for making a new item.
        // Add the amount.
        itemClone.quantity += quantity;
        const hash = utilityEncryption.generateHash(JSON.stringify(itemClone));
        itemClone.hash = hash;

        let undefinedIndex = player.inventory.findIndex(x => x === null);

        // Prevent Using Equipment Slots
        if (undefinedIndex === -1 || undefinedIndex >= 28) {
            player.send(`You have no room for that item.`);
            return false;
        }

        player.inventory[undefinedIndex] = itemClone;
        player.data.inventory = JSON.stringify(player.inventory);
        player.saveField(player.data.id, 'inventory', player.data.inventory);
        player.syncInventory();
        return true;
    };

    player.swapItems = (newIndexPos, oldIndexPos) => {
        let newIndexItem = { ...player.inventory[newIndexPos] };
        let oldIndexItem = { ...player.inventory[oldIndexPos] };

        // Handle Empty Object
        if (newIndexItem) {
            if (
                newIndexItem.constructor === Object &&
                Object.entries(newIndexItem).length === 0
            )
                newIndexItem = null;
        }

        // Handle Empty Object
        if (oldIndexItem) {
            if (
                oldIndexItem.constructor === Object &&
                Object.entries(oldIndexItem).length === 0
            )
                oldIndexItem = null;
        }

        player.inventory[newIndexPos] = oldIndexItem;
        player.inventory[oldIndexPos] = newIndexItem;

        if (player.inventory[37]) {
            if (player.inventory[37].props.hash) {
                player.setWeapon(player.inventory[37].props.hash);
            }
        } else {
            player.removeAllWeapons();
        }

        player.data.inventory = JSON.stringify(player.inventory);
        player.saveField(player.data.id, 'inventory', player.data.inventory);
        player.syncInventory();
    };

    player.setWeapon = hash => {
        player.removeAllWeapons();
        player.giveWeapon(hash, 999, true);
    };

    // Remove an item from a player.
    player.subItem = (itemTemplate, quantity) => {
        let index = player.inventory.findIndex(
            x => x !== null && x !== undefined && x.label === itemTemplate.label
        );

        if (index <= -1) return false;

        if (player.inventory[index].quantity < quantity) return false;

        alt.emit('inventory:SubItem', player, index, quantity);
        return true;
    };

    player.hasItem = itemName => {
        let items = player.inventory.filter(x => x !== null && x !== undefined);
        if (items.length <= 0) return false;
        let item = items.find(x => x.label && x.label.includes(itemName));
        if (!item) return false;
        return true;
    };

    player.subItemByHash = (itemHash, quantity) => {
        let index = player.inventory.findIndex(
            x => x !== null && x !== undefined && x.hash === itemHash
        );

        if (index <= -1) return false;

        if (player.inventory[index].quantity < quantity) return false;

        alt.emit('inventory:SubItem', player, index, quantity);
        return true;
    };

    player.addItemByHash = (itemHash, quantity) => {
        let index = player.inventory.findIndex(
            x => x !== null && x !== undefined && x.hash === itemHash
        );

        if (index <= -1) return false;

        alt.emit('inventory:AddItem', player, index, quantity);
    };

    player.destroyItem = itemHash => {
        let index = player.inventory.findIndex(
            x => x !== null && x !== undefined && x.hash === itemHash
        );

        if (index <= -1) return false;

        player.send(`${player.inventory[index].label} was destroyed.`);
        player.subItemByHash(itemHash, 1);
        return true;
    };

    // Mostly for consumption / item effects.
    player.consumeItem = itemHash => {
        let index = player.inventory.findIndex(
            x => x !== null && x !== undefined && x.hash === itemHash
        );

        if (index <= -1) return false;

        let consumedItem = {
            label: player.inventory[index].label,
            props: player.inventory[index].props
        };

        // Failed to consume.
        if (!player.subItemByHash(itemHash, 1)) return false;
        alt.emit('item:Consume', player, consumedItem);
        return true;
    };

    // Mostly for displaying items.
    player.useItem = itemHash => {
        let index = player.inventory.findIndex(
            x => x !== null && x !== undefined && x.hash === itemHash
        );

        if (index <= -1) return false;

        let consumedItem = {
            label: player.inventory[index].label,
            props: player.inventory[index].props
        };

        alt.emit('item:Use', player, consumedItem);
        player.updateInventory();
        return true;
    };

    player.updateInventory = () => {
        player.syncInventory();
        alt.emitClient(player, 'inventory:FetchItems');
    };

    player.addStarterItems = () => {
        let shirt = { ...configurationItems.Items['Shirt'] };
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

        let pants = { ...configurationItems.Items['Pants'] };
        pants.props = {
            description: 'Starter Pants',
            restriction: -1,
            female: [{ id: 4, value: 0, texture: 2 }],
            male: [{ id: 4, value: 0, texture: 0 }]
        };

        let shoes = { ...configurationItems.Items['Shoes'] };
        shoes.props = {
            description: 'Starter Pants',
            restriction: -1,
            female: [{ id: 6, value: 3, texture: 0 }],
            male: [{ id: 6, value: 1, texture: 0 }]
        };

        player.addItem(shirt, 1);
        player.addItem(pants, 1);
        player.addItem(shoes, 1);
    };

    // =================================
    // SOUND
    player.playAudio = soundName => {
        alt.emitClient(player, 'sound:PlayAudio', soundName);
    };

    // =================================
    // Animation
    player.playAnimation = (
        dictionary,
        name,
        durationInMS,
        flag,
        freezeX = false,
        freezeY = false,
        freezeZ = false
    ) => {
        alt.emitClient(
            null,
            'animation:PlayAnimation',
            player,
            dictionary,
            name,
            durationInMS,
            flag,
            freezeX,
            freezeY,
            freezeZ
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
                alt.emit('vehicles:SpawnVehicle', player, veh);
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

        // Spawn a reference vehicle. Then destroy it.
        let tempVeh = new alt.Vehicle(model, 0, 0, 0, 0, 0, 0);
        let health = tempVeh.getHealthDataBase64();
        tempVeh.destroy();

        db.upsertData(
            {
                guid: player.data.id,
                position: JSON.stringify(pos),
                rotation: JSON.stringify(rot),
                model,
                health
            },
            'Vehicle',
            veh => {
                alt.emit('vehicles:SpawnVehicle', player, veh);
            }
        );
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
