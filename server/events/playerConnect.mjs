import * as alt from 'alt';
import * as chat from 'chat';
import {
    RegisterCamPoint,
    RegisterCamDirection
} from '../configuration/coordinates.mjs';
import * as playerutil from '../utility/player.mjs';
import * as interactionATM from '../interactions/atms.mjs';
import * as interactionClothing from '../interactions/clothing.mjs';

console.log('Loaded: events->playerConnect.mjs');

alt.on('playerConnect', player => {
    alt.log(`${player.name} has connected.`);

    // Setup chat functionality from Chat-Extended
    chat.setupPlayer(player);

    // Setup extended functions for player
    playerutil.setupPlayerFunctions(player);

    // Teleport player to location for the time being.
    player.pos = RegisterCamPoint;
    player.showRegisterDialogue(RegisterCamPoint, RegisterCamDirection);

    // Setup Interactions
    interactionATM.synchronizeBlips(player);
    interactionClothing.synchronizeBlips(player);
});
