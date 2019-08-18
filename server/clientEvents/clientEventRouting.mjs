import * as alt from 'alt';
import * as register from '../registration/register.mjs';
import * as login from '../registration/login.mjs';
import * as facedata from '../character/facedata.mjs';
import * as facecustomizer from '../customizers/facialcustomizer.mjs';
import * as locationhelper from '../utility/locationhelper.mjs';
import * as roleplayname from '../character/roleplayname.mjs';
import * as interaction from '../systems/interactionsystem.mjs';
import * as interactionAtm from '../interactions/atms.mjs';

// On load; send a message.
console.log('Loaded: clientEvents->clientEventRouting.mjs');

// Called when a client attempts to Register an account.
alt.onClient('register:NewAccount', register.newAccount);

// Called when a client attempts to Login to an account.
alt.onClient('register:ExistingAccount', login.existingAccount);

// Set the player's facial data from the customizer.
alt.onClient('facecustomizer:setFacialData', facedata.setFacialData);

// Request the facial customizer.
alt.onClient(
    'facialcustomizer:requestFacialCustomizer',
    facecustomizer.requestFacialCustomizer
);

// Go To Last Location
alt.onClient('utility:GoToLastLocation', locationhelper.goToLastLocation);

// Set the users roleplay name
alt.onClient('roleplayname:SetRoleplayName', roleplayname.setRoleplayName);

// Interaction Stuff
alt.onClient('interaction:Exec', interaction.attemptToExecuteInteraction);

// Atm Handler
alt.onClient('atm:Withdraw', interactionAtm.withdraw);
alt.onClient('atm:Deposit', interactionAtm.deposit);

// Temporary:
// teleport to waypoint stuff
alt.onClient('temporaryTeleport', (player, coords) => {
    player.tempPos = player.pos;
    player.pos = coords;
});
