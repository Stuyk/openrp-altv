import * as alt from 'alt';
import * as chat from 'chat';
import {
    RegisterCamPoint,
    RegisterCamDirection
} from '../configuration/coordinates.mjs';
import * as utilityPlayer from '../utility/player.mjs';
import * as interactionsAtms from '../interactions/atms.mjs';
import * as interactionsClothing from '../interactions/clothing.mjs';

console.log('Loaded: events->playerConnect.mjs');

alt.on('playerConnect', player => {
    player.sp = false;
    player.setSyncedMeta('loggedin', false);

    alt.emitClient(player, 'startLogin');

    alt.log(`${player.name} has connected.`);
    player.pos = RegisterCamPoint;

    // Setup chat functionality from Chat-Extended
    chat.setupPlayer(player);

    // Setup extended functions for player
    utilityPlayer.setupPlayerFunctions(player);

    // Teleport player to location for the time being.
    player.pos = RegisterCamPoint;
    player.showRegisterDialogue(RegisterCamPoint, RegisterCamDirection);

    // Setup Interactions
    interactionsAtms.synchronizeBlips(player);
    interactionsClothing.synchronizeBlips(player);
});
