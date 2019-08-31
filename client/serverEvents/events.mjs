import * as alt from 'alt';

// Registration
import * as registration from 'client/registration/registration.mjs';

// Blips
import * as blipsBlipHelper from 'client/blips/bliphelper.mjs';

// Character
import * as characterClothing from 'client/character/clothing.mjs';
import * as characterFace from 'client/character/face.mjs';

// Customizers
import * as customizersClothing from 'client/customizers/clothing.mjs';
import * as customizersCharacter from 'client/customizers/character.mjs';

// Systems
import * as systemsInventory from 'client/systems/inventory.mjs';
import * as systemsSound from 'client/systems/sound.mjs';
import * as systemsAnimation from 'client/systems/animation.mjs';
import * as systemsVehicles from 'client/systems/vehicles.mjs';
import * as systemsJob from 'client/systems/job.mjs';

// Panels
import * as panelsChat from 'client/panels/chat.mjs';
import * as panelsAtm from 'client/panels/atm.mjs';
import * as panelsName from 'client/panels/name.mjs';
import * as panelsInventory from 'client/panels/inventory.mjs';

// Utility
import * as utilityScreenFades from 'client/utility/screenfades.mjs';

alt.log('Loaded: client->serverEvents->serverEventRouting.mjs');

// =============================================
// Quick Summary:
// This file looks this way because this is the only
// solution that won't over-engineer our imports.
// Importing each individual file this way; allows us
// to easily import a majority of code without importing
// nearly as many files in various other places.
// =============================================
// REGISTRATION / LOGIN
// Called when the player first joins the server,
// displays the login camera to the user.
// Takes two parameters: (regCamCoord, regCamPointAtCoord)
alt.onServer('register:ShowDialogue', registration.showDialogue);

// Called when there's an error/alert in the registration.
// Params: msg
alt.onServer('register:EmitEventError', registration.showError);
alt.onServer('register:EmitEventSuccess', registration.showSuccess);
// Params: NONE
alt.onServer('register:ShowLogin', registration.showLogin);

// Finish the login; and disable un-necessary events.
alt.onServer('register:CloseDialogue', registration.closeDialogue);

// =======================================================
// PLAYER RESPAWN
// Reset the characters blood
alt.onServer('respawn:ClearPedBloodDamage', customizersCharacter.clearPedBloodDamage);

// =======================================================
// CHARACTER FACE CUSTOMIZER
// Shows the face customizer overlay.
alt.onServer('face:ShowDialogue', customizersCharacter.showDialogue);

// =======================================================
// CHARACTER SPECIFIC EVENTS
// Parses the users face information and applies it to the ped.
alt.onServer('face:ApplyFacialData', characterFace.applyFacialData);

// =======================================================
// Screen Fade Effects, self explanatory; mostly takes millisecond parameters.
alt.onServer('screen:FadeOut', utilityScreenFades.fadeOut);
alt.onServer('screen:FadeIn', utilityScreenFades.fadeIn);
alt.onServer('screen:BlurOut', utilityScreenFades.blurOut);
alt.onServer('screen:BlurIn', utilityScreenFades.blurIn);
alt.onServer('screen:FadeOutFadeIn', utilityScreenFades.fadeOutFadeIn); // 2 params of milliseconds

// =======================================================
// Set Character Name
alt.onServer('roleplayname:ShowDialogue', panelsName.showDialogue);
alt.onServer('roleplayname:ShowNameTaken', panelsName.showNameTaken);
alt.onServer('roleplayname:CloseDialogue', panelsName.closeDialogue);

// =======================================================
// Create Blip
alt.onServer('blip:CreateBlip', blipsBlipHelper.createBlip);

// =======================================================
// ATM Events
alt.onServer('atm:ShowDialogue', panelsAtm.showDialogue);
alt.onServer('atm:CloseDialogue', panelsAtm.closeDialogue);
alt.onServer('atm:UpdateCash', panelsAtm.updateCash);
alt.onServer('atm:UpdateBank', panelsAtm.updateBank);
alt.onServer('atm:ShowSuccess', panelsAtm.showSuccess);

// =======================================================
// Clothing Events
alt.onServer('clothing:ShowDialogue', customizersClothing.showDialogue);
alt.onServer('clothing:CloseDialogue', customizersClothing.closeDialogue);

// =======================================================
// Clothing Events
alt.onServer('clothing:SyncClothing', characterClothing.syncClothing);

// =======================================================
// Inventory
// Sync
alt.onServer('inventory:FetchItems', panelsInventory.fetchItems);
// Drop Item
alt.onServer('inventory:ItemDrop', systemsInventory.itemDrop);
// Pickup Item
alt.onServer('inventory:ItemPickup', systemsInventory.itemPickup);

// =======================================================
// Sound
alt.onServer('sound:PlayAudio', systemsSound.playAudio);

// =======================================================
// Animation
// playAnimation(dictionary, name, durationInMS, flag)
alt.onServer('animation:PlayAnimation', systemsAnimation.playAnimation);

// =======================================================
// Vehicle
alt.onServer('vehicle:CloseDoor', systemsVehicles.closeDoor);
alt.onServer('vehicle:OpenDoor', systemsVehicles.openDoor);
alt.onServer('vehicle:ShutAllDoors', systemsVehicles.shutAllDoors);
alt.onServer('vehicle:EngineOn', systemsVehicles.engineOn);
alt.onServer('vehicle:EngineOff', systemsVehicles.engineOff);
alt.onServer('vehicle:Eject', systemsVehicles.eject);
alt.onServer('vehicle:Repair', systemsVehicles.repair);

// =======================================================
// Chat
alt.onServer('chat:Send', panelsChat.send);
