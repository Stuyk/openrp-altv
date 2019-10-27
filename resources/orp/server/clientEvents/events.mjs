import * as alt from 'alt';
// Imports are named after the folder and
// file name. ie. characterClothing = ../character/clothing
import * as registrationLogin from '../registration/login.mjs';
import * as characterFace from '../character/face.mjs';
import * as utilityLocationHelper from '../utility/locationhelper.mjs';
import * as characterInfo from '../character/info.mjs';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsInventory from '../systems/inventory.mjs';
import * as systemsVehicles from '../systems/vehicles.mjs';
import * as systemsJob from '../systems/job.mjs';
import * as systemsAtm from '../systems/atm.mjs';
import * as systemsPhone from '../systems/phone.mjs';
import * as systemsSkills from '../systems/skills.mjs';
import * as systemsVehicleVendor from '../systems/vehiclevendor.mjs';
import * as characterClothing from '../character/clothing.mjs';
import * as chat from '../chat/chat.mjs';

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
alt.onClient('character:New', characterInfo.newCharacter);

// Interaction Stuff
alt.onClient('interaction:Exec', systemsInteraction.attemptToExecuteInteraction);

// Atm Handler
alt.onClient('atm:Withdraw', systemsAtm.withdraw);
alt.onClient('atm:Deposit', systemsAtm.deposit);
alt.onClient('atm:Ready', systemsAtm.ready);

// Clothing Handler
alt.onClient('clothing:Purchase', characterClothing.purchase);
alt.onClient('clothing:Resync', characterClothing.resync);

// Inventory
alt.onClient('inventory:DestroyItem', systemsInventory.destroy);
alt.onClient('inventory:UseItem', systemsInventory.use);
alt.onClient('inventory:DropItem', systemsInventory.drop);
alt.onClient('inventory:Pickup', systemsInventory.pickup);
alt.onClient('inventory:SwapItem', systemsInventory.swapItem);
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

// Temporary:
// teleport to waypoint stuff
alt.onClient('temporaryTeleport', (player, coords) => {
    player.tempPos = player.pos;
    player.pos = coords;
});
