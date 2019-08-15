import * as alt from 'alt';
import * as register from '../registration/register.mjs';
import * as login from '../registration/login.mjs';
import * as facedata from '../character/facedata.mjs';
import * as facecustomizer from '../customizers/facialcustomizer.mjs';
import * as locationhelper from '../utility/locationhelper.mjs';
import * as roleplayname from '../character/roleplayname.mjs';

// On load; send a message.
console.log('Loaded: clientEvents->clientEventRouting.mjs');

// Called when a client attempts to Register an account.
alt.onClient('registerAccount', register.userRegister);

// Called when a client attempts to Login to an account.
alt.onClient('existingAccount', login.userLogin);

// Set the player's facial data from the customizer.
alt.onClient('setPlayerFacialData', facedata.setFacialData);

// Request the facial customizer.
alt.onClient('requestFaceCustomizer', facecustomizer.requestFacialCustomizer);

// Go To Last Location
alt.onClient('requestLastLocation', locationhelper.goToLastLocation);

// Set the users roleplay name
alt.onClient('setRoleplayName', roleplayname.setRoleplayName);

// Temporary:
// teleport to waypoint stuff
alt.onClient('temporaryTeleport', (player, coords) => {
    player.tempPos = player.pos;
    player.pos = coords;
});
