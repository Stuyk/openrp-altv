import * as alt from 'alt';

// Registration
import * as panelsRegistration from '/client/panels/registration.mjs';

// Blips
import * as blipsBlipHelper from '/client/blips/bliphelper.mjs';

// Character
import * as systemsCharacter from '/client/systems/character.mjs';

// Systems
import * as systemsInventory from '/client/systems/inventory.mjs';
import * as systemsSound from '/client/systems/sound.mjs';
import * as systemsAnimation from '/client/systems/animation.mjs';
import * as systemsVehicles from '/client/systems/vehicles.mjs';

// Panels
import * as panelsChat from '/client/panels/chat.mjs';
import * as panelsAtm from '/client/panels/atm.mjs';
import * as panelsInfo from '/client/panels/info.mjs';
import * as panelsInventory from '/client/panels/inventory.mjs';
import * as panelsClothing from '/client/panels/clothing.mjs';
import * as panelsCharacter from '/client/panels/character.mjs';
import * as panelsMdc from '/client/panels/mdc.mjs';
import * as panelsHud from '/client/panels/hud.mjs';

import * as meta from '/client/meta/meta.mjs';

// Utility
import * as utilityScreenFades from '/client/utility/screenfades.mjs';

alt.log('Loaded: client->serverEvents->events.mjs');

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
alt.onServer('register:ShowDialogue', panelsRegistration.showDialogue);

// Called when there's an error/alert in the registration.
// Params: msg
alt.onServer('register:EmitEventError', panelsRegistration.showError);
alt.onServer('register:EmitEventSuccess', panelsRegistration.showSuccess);
// Params: NONE
alt.onServer('register:ShowLogin', panelsRegistration.showLogin);

// Finish the login; and disable un-necessary events.
alt.onServer('register:CloseDialogue', panelsRegistration.closeDialogue);

// =======================================================
// PLAYER RESPAWN
// Reset the characters blood
alt.onServer('respawn:ClearPedBloodDamage', panelsCharacter.clearPedBloodDamage);

// =======================================================
// CHARACTER FACE CUSTOMIZER
// Shows the face customizer overlay.
alt.onServer('face:ShowDialogue', panelsCharacter.showDialogue);

// =======================================================
// Screen Fade Effects, self explanatory; mostly takes millisecond parameters.
alt.onServer('screen:FadeOut', utilityScreenFades.fadeOut);
alt.onServer('screen:FadeIn', utilityScreenFades.fadeIn);
alt.onServer('screen:BlurOut', utilityScreenFades.blurOut);
alt.onServer('screen:BlurIn', utilityScreenFades.blurIn);
alt.onServer('screen:FadeOutFadeIn', utilityScreenFades.fadeOutFadeIn); // 2 params of milliseconds

// =======================================================
// Set Character Name
alt.onServer('roleplayinfo:ShowDialogue', panelsInfo.showDialogue);
alt.onServer('roleplayinfo:CloseDialogue', panelsInfo.closeDialogue);

// =======================================================
// Handle Blips
alt.onServer('blip:CreateBlip', blipsBlipHelper.createBlip);
alt.onServer('blip:CreateAreaBlip', blipsBlipHelper.createAreaBlip);
alt.onServer('blip:CreateSectorBlip', blipsBlipHelper.createSectorBlip);
alt.onServer('blip:CleanSectorBlips', blipsBlipHelper.cleanSectorBlips);

// =======================================================
// ATM Events
alt.onServer('atm:ShowDialogue', panelsAtm.showDialogue);
alt.onServer('atm:UpdateCash', panelsAtm.updateCash);
alt.onServer('atm:UpdateBank', panelsAtm.updateBank);
alt.onServer('atm:ShowSuccess', panelsAtm.showSuccess);

// =======================================================
// Clothing Events
alt.onServer('clothing:ShowDialogue', panelsClothing.showDialogue);
alt.onServer('clothing:CloseDialogue', panelsClothing.closeDialogue);

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
alt.onServer('sound:PlayAudio3D', systemsSound.playAudio3D);

// =======================================================
// Animation
// playAnimation(dictionary, name, durationInMS, flag)
alt.onServer('animation:PlayAnimation', systemsAnimation.playAnimation);

// =======================================================
// Vehicle
alt.onServer('vehicle:ToggleDoor', systemsVehicles.toggleDoor);
alt.onServer('vehicle:Eject', systemsVehicles.eject);
alt.onServer('vehicle:Repair', systemsVehicles.repair);
alt.onServer('vehicle:StartEngine', systemsVehicles.startEngine);
alt.onServer('vehicle:SoundHorn', systemsVehicles.soundHorn);
alt.onServer('vehicle:SetIntoVehicle', systemsVehicles.setIntoVehicle);

// =======================================================
// Chat
alt.onServer('chat:Send', panelsChat.send);
alt.onServer('chat:SetStatus', panelsChat.setStatus);

// =======================================================
// MDC
alt.onServer('mdc:ShowDialogue', panelsMdc.showDialogue);
alt.onServer('mdc:Data', panelsMdc.data);

// =======================================================
// Global
alt.onServer('meta:Emit', meta.emit);
