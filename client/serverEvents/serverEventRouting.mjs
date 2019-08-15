import * as alt from 'alt';
import * as registration from 'client/registration/registration.mjs';
import * as facecustomizer from 'client/customizers/character.mjs';
import * as facedata from 'client/character/facedata.mjs';
import * as screenfades from 'client/utility/screenfades.mjs';
import * as charactername from 'client/character/roleplayname.mjs';

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
alt.onServer('requestFaceCustomizer', facecustomizer.loadCharacterCustomizer);

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
alt.onServer('chooseRoleplayName', charactername.chooseRoleplayName);
alt.onServer('roleplayNameTaken', charactername.nameTaken);
alt.onServer('closeRoleplayNameDialog', charactername.closeRoleplayNameDialog);
