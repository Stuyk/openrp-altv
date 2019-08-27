import * as alt from 'alt';
// Imports are named after the folder and
// file name. ie. characterClothing = ../character/clothing
import * as registrationRegister from '../registration/register.mjs';
import * as registrationLogin from '../registration/login.mjs';
import * as characterFace from '../character/face.mjs';
import * as customizersFace from '../customizers/face.mjs';
import * as utilityLocationHelper from '../utility/locationhelper.mjs';
import * as characterName from '../character/name.mjs';
import * as systemsInteraction from '../systems/interaction.mjs';
import * as systemsInventory from '../systems/inventory.mjs';
import * as systemsVehicles from '../systems/vehicles.mjs';
import * as systemsJob from '../systems/job.mjs';
import * as interactionAtms from '../interactions/atms.mjs';
import * as characterClothing from '../character/clothing.mjs';
import * as chat from '../chat/chat.mjs';

// On load; send a message.
console.log('Loaded: clientEvents->events.mjs');

// ====================================================
// Registration
// Called when a client attempts to Register an account.
alt.onClient('register:NewAccount', registrationRegister.newAccount);

// Called when a client attempts to Login to an account.
alt.onClient('register:ExistingAccount', registrationLogin.existingAccount);

alt.onClient('register:Ready', registrationLogin.ready);

// ====================================================
// Face
// Set the player's facial data from the customizer.
alt.onClient('face:SetFacialData', characterFace.setFacialData);

// Request the facial customizer.
alt.onClient('face:ShowDialogue', customizersFace.showFace);

// ====================================================
// Utility
// Go To Last Location
alt.onClient('utility:GoToLastLocation', utilityLocationHelper.goToLastLocation);

// ====================================================
// Registration
// Set the users roleplay name
alt.onClient('character:SetRoleplayName', characterName.setRoleplayName);

// Interaction Stuff
alt.onClient('interaction:Exec', systemsInteraction.attemptToExecuteInteraction);

// Atm Handler
alt.onClient('atm:Withdraw', interactionAtms.withdraw);
alt.onClient('atm:Deposit', interactionAtms.deposit);

// Clothing Handler
alt.onClient('clothing:SaveClothing', characterClothing.saveClothing);

// Inventory
alt.onClient('inventory:DestroyItem', systemsInventory.destroy);
alt.onClient('inventory:UseItem', systemsInventory.use);
alt.onClient('inventory:DropItem', systemsInventory.drop);
alt.onClient('inventory:Pickup', systemsInventory.pickup);

// Vehicle
alt.onClient('vehicle:ToggleDoor', systemsVehicles.toggleDoor);
alt.onClient('vehicle:EngineOn', systemsVehicles.engineOn);
alt.onClient('vehicle:EngineOff', systemsVehicles.engineOff);
alt.onClient('vehicle:LockAllDoors', systemsVehicles.lockAllDoors);

// Chat
alt.onClient('chat:RouteMessage', chat.routeMessage);

// Job
alt.onClient('job:TestObjective', systemsJob.testObjective);

// Temporary:
// teleport to waypoint stuff
alt.onClient('temporaryTeleport', (player, coords) => {
    player.tempPos = player.pos;
    player.pos = coords;
});
