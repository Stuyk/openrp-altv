import * as alt from 'alt';
//import * as chat from 'chat';
import { Config } from '../configuration/config.mjs';
import * as utilityPlayer from '../utility/player.mjs';

alt.on('playerConnect', player => {
    alt.log(`${player.name} has connected.`);

    // Player Extensions
    utilityPlayer.setupPlayerFunctions(player);
    if (player.getMeta('isLoggedIn')) return;

    // Setup the Login Camera
    player.pos = Config.registerCamPoint;
    player.dimension = 0;
    player.setSyncedMeta('loggedin', false);

    alt.emitClient(player, 'discord:Request');

    //player.showRegisterDialogue(Config.registerCamPoint);
});
