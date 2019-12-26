import * as alt from 'alt';
// Imports are named after the folder and
// file name. ie. characterClothing = ../character/clothing
import * as registrationLogin from '../registration/login.js';
import * as characterFace from '../character/face.js';
import * as utilityLocationHelper from '../utility/locationhelper.js';
import * as characterInfo from '../character/info.js';
import * as systemsGeneralStore from '../systems/generalstore.js';
import * as systemsInteraction from '../systems/interaction.js';
import * as systemsInventory from '../systems/inventory.js';
import * as systemsVehicles from '../systems/vehicles.js';
import * as systemsJob from '../systems/job.js';
import * as systemsPhone from '../systems/phone.js';
import * as systemsSkills from '../systems/skills.js';
import * as systemsVehicleVendor from '../systems/vehiclevendor.js';
import * as characterClothing from '../character/clothing.js';
import * as chat from '../chat/chat.js';

// ====================================================
// Registration
// Called when a client attempts to Register an account.
alt.onClient('sync:Ready', registrationLogin.sync);

// ====================================================
// Face
// Set the player's facial data from the customizer.
alt.onClient('face:SetFacialData', characterFace.setFacialData);

// ====================================================
// Utility
// Go To Last Location
alt.onClient('utility:GoToLastLocation', utilityLocationHelper.goToLastLocation);

// ====================================================
// Registration
// Set the users roleplay info
alt.onClient('character:SetRoleplayInfo', characterInfo.setRoleplayInfo);
alt.onClient('character:Select', characterInfo.select);

// Interaction Stuff
alt.onClient('interaction:Exec', systemsInteraction.attemptToExecuteInteraction);

// Clothing Handler
alt.onClient('clothing:Purchase', characterClothing.purchase);
alt.onClient('clothing:Resync', characterClothing.resync);

// Inventory
alt.onClient('inventory:DestroyItem', systemsInventory.destroy);
alt.onClient('inventory:UseItem', systemsInventory.use);
alt.onClient('inventory:DropItem', systemsInventory.drop);
alt.onClient('inventory:Pickup', systemsInventory.pickup);
alt.onClient('inventory:RenameItem', systemsInventory.rename);
alt.onClient('inventory:UnequipItem', systemsInventory.unequipItem);
alt.onClient('inventory:Split', systemsInventory.splitItem);

// Vehicle
alt.onClient('vehicle:ToggleDoor', systemsVehicles.toggleDoor);
alt.onClient('vehicle:ToggleLock', systemsVehicles.toggleLock);
alt.onClient('vehicle:ToggleEngine', systemsVehicles.toggleEngine);
alt.onClient('vehicle:SafetyLock', systemsVehicles.toggleSafetyLock);
alt.onClient('vehicle:SaveChanges', systemsVehicles.saveChanges);
alt.onClient('vehicle:FillFuel', systemsVehicles.fillFuel);
alt.onClient('vehicle:CheckFuel', systemsVehicles.checkFuel);
alt.onClient('vehicle:CloseAllDoors', systemsVehicles.closeAllDoors);
alt.onClient('vehicle:RepairVehicle', systemsVehicles.repairVehicle);
alt.onClient('vehicle:TrackVehicle', systemsVehicles.trackVehicle);
alt.onClient('vehicle:RefuelVehicle', systemsVehicles.refuelVehicle); // gas can
alt.onClient('vehicle:DestroyVehicle', systemsVehicles.destroyVehicle);
alt.onClient('vehicle:LeaveEngineRunning', systemsVehicles.leaveEngineRunning);

// Phone
alt.onClient('phone:AddContact', systemsPhone.addContact);
alt.onClient('phone:DeleteContact', systemsPhone.deleteContact);

// Vehicle Vendor
alt.onClient('vehiclevendor:Purchase', systemsVehicleVendor.purchaseVehicle);

// Chat
alt.onClient('chat:RouteMessage', chat.routeMessage);
alt.onClient('chat:IsChatting', chat.setStatus);

// Job
alt.onClient('job:Check', systemsJob.check);
alt.onClient('job:SkipToBeginning', systemsJob.skipToBeginning);
alt.onClient('job:Quit', systemsJob.quitJob);

// Skills
alt.onClient('skill:Agility', systemsSkills.agility);

// GeneralStore
alt.onClient('general:GetItems', systemsGeneralStore.getItems);
alt.onClient('general:BuyItem', systemsGeneralStore.buyItem);

//
alt.onClient('reset:Dimension', player => {
    player.saveDimension(0);
});
