import * as alt from 'alt';
import * as native from 'natives';

// Blips
import * as blipsBlipHelper from '/client/blips/bliphelper.js';

// Character
import * as systemsCharacter from '/client/systems/character.js';

// Systems
import * as systemsSound from '/client/systems/sound.js';
import * as systemsAnimation from '/client/systems/animation.js';
import * as systemsVehicles from '/client/systems/vehicles.js';

// Panels
import * as panelsChat from '/client/panels/chat.js';
import * as panelsInfo from '/client/panels/info.js';
import * as panelsInventory from '/client/panels/inventory.js';
import * as panelsClothing from '/client/panels/clothing.js';
import * as panelsCharacter from '/client/panels/character.js';
import * as panelsMdc from '/client/panels/mdc.js';
import * as panelsHud from '/client/panels/hud.js';
import * as panelsVehicleVendor from '/client/panels/vehiclevendor.js';
import * as panelsCharacterSelect from '/client/panels/characterselect.js';

import * as meta from '/client/meta/meta.js';

// Utility
import * as utilityScreenFades from '/client/utility/screenfades.js';

alt.log('Loaded: client->serverEvents->events.js');

// =============================================
// Quick Summary:
// This file looks this way because this is the only
// solution that won't over-engineer our imports.
// Importing each individual file this way; allows us
// to easily import a majority of code without importing
// nearly as many files in various other places.
// ============================================
// =======================================================
// PLAYER RESPAWN
// Reset the characters blood
alt.onServer('respawn:ClearPedBloodDamage', () => {
    native.clearPedBloodDamage(alt.Player.local.scriptID);
});

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
// Clothing Events
alt.onServer('clothing:ShowDialogue', panelsClothing.showDialogue);
alt.onServer('clothing:CloseDialogue', panelsClothing.closeDialogue);

// =======================================================
// Inventory
// Sync
alt.onServer('inventory:FetchItems', panelsInventory.fetchItems);

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
alt.onServer('vehicle:TrackVehicle', systemsVehicles.trackVehicle);
alt.onServer('vehicle:ForceEngineOn', systemsVehicles.forceEngineOn);
alt.onServer('vehicle:KillEngine', systemsVehicles.killEngine);

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

// =======================================================
// Vehicle Vendors
alt.onServer('vehiclevendor:ShowDialogue', panelsVehicleVendor.showDialogue);

// =======================================================
// Character Select
alt.onServer('character:Select', panelsCharacterSelect.showDialogue);
