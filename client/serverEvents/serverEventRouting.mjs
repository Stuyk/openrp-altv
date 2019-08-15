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
alt.onServer('registerShowCamera', registration.registerShowCamera);

// Called when there's an error/alert in the registration.
alt.onServer('registerEvent', registration.registerEventError);
alt.onServer('registerEventSuccess', registration.registerEventSuccess);
alt.onServer('registerEventGoToLogin', registration.registerEventGoToLogin);

// =======================================================
// REGISTRATION
// Finish the login; and disable un-necessary events.
alt.onServer('finishLogin', registration.finishLogin);

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
alt.onServer('fadeOut', screenfades.fadeOut);
alt.onServer('fadeIn', screenfades.fadeIn);
alt.onServer('blurOut', screenfades.blurOut);
alt.onServer('blurIn', screenfades.blurIn);
alt.onServer('fadeOutFadeIn', screenfades.fadeOutFadeIn); // 2 params of milliseconds

// =======================================================
// Set Character Name
alt.onServer('chooseRoleplayName', charactername.chooseRoleplayName);
alt.onServer('roleplayNameTaken', charactername.nameTaken);
alt.onServer('closeRoleplayNameDialog', charactername.closeRoleplayNameDialog);
