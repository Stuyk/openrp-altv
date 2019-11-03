import * as alt from 'alt';
//import * as chat from 'chat';
import { Config } from '../configuration/config.mjs';

alt.on('playerConnect', player => {
    alt.log(`${player.name} has connected.`);

    // Setup the Login Camera
    player.pos = Config.characterPoint;
    player.dimension = Math.floor(Math.random() * 50000);
    player.setSyncedMeta('loggedin', false);
});
