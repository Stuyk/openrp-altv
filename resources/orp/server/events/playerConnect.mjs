import * as alt from 'alt';
//import * as chat from 'chat';
import { RegisterCamPoint } from '../configuration/coordinates.mjs';
import * as utilityPlayer from '../utility/player.mjs';

console.log('Loaded: events->playerConnect.mjs');

alt.on('playerConnect', player => {
    alt.log(`${player.name} has connected.`);

    // Player Extensions
    utilityPlayer.setupPlayerFunctions(player);
    if (player.getMeta('isLoggedIn')) return;

    // Setup the Login Camera
    player.pos = RegisterCamPoint;
    player.dimension = 0;
    player.setSyncedMeta('loggedin', false);
    player.showRegisterDialogue(RegisterCamPoint);
});
