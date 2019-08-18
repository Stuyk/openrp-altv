import * as alt from 'alt';
import * as registration from 'client/registration/registration.mjs';
import * as facecustomizer from 'client/customizers/character.mjs';
import * as facedata from 'client/character/facedata.mjs';
import * as screenfades from 'client/utility/screenfades.mjs';
import * as roleplayname from 'client/character/roleplayname.mjs';
import * as bliphelper from 'client/blips/bliphelper.mjs';
import * as atmPanel from 'client/panels/atm.mjs';
import * as clothing from 'client/character/clothing.mjs';
import * as clothingPanel from 'client/customizers/clothing.mjs';

alt.log('Loaded: client->serverEvents->serverEventRouting.mjs');

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
// CHARACTER FACE CUSTOMIZER
// Shows the face customizer overlay.
alt.onServer('facecustomizer:ShowDialogue', facecustomizer.showDialogue);

// =======================================================
// CHARACTER SPECIFIC EVENTS
// Parses the users face information and applies it to the ped.
alt.onServer('applyFacialData', facedata.applyFacialData);

// =======================================================
// Screen Fade Effects, self explanatory; mostly takes millisecond parameters.
alt.onServer('screen:FadeOut', screenfades.fadeOut);
alt.onServer('screen:FadeIn', screenfades.fadeIn);
alt.onServer('screen:BlurOut', screenfades.blurOut);
alt.onServer('screen:BlurIn', screenfades.blurIn);
alt.onServer('screen:FadeOutFadeIn', screenfades.fadeOutFadeIn); // 2 params of milliseconds

// =======================================================
// Set Character Name
alt.onServer('roleplayname:ShowDialogue', roleplayname.showDialogue);
alt.onServer('roleplayname:ShowNameTaken', roleplayname.showNameTaken);
alt.onServer('roleplayname:CloseDialogue', roleplayname.closeDialogue);

// =======================================================
// Create Blip
alt.onServer('blip:CreateBlip', bliphelper.createBlip);

// =======================================================
// ATM Events
alt.onServer('atm:ShowDialogue', atmPanel.showDialogue);
alt.onServer('atm:CloseDialogue', atmPanel.closeDialogue);
alt.onServer('atm:UpdateCash', atmPanel.updateCash);
alt.onServer('atm:UpdateBank', atmPanel.updateBank);
alt.onServer('atm:ShowSuccess', atmPanel.showSuccess);

// =======================================================
// Clothing Panel Events
alt.onServer('clothing:ShowDialogue', clothingPanel.showDialogue);
alt.onServer('clothing:CloseDialogue', clothingPanel.closeDialogue);

// =======================================================
// Clothing Events
alt.onServer('clothing:SyncClothing', clothing.syncClothing);
