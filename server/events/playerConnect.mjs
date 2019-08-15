import * as alt from 'alt';
import * as chat from 'chat';
import {
    RegisterCamPoint,
    RegisterCamDirection
} from '../configuration/coordinates.mjs';

console.log('Loaded: events->playerConnect.mjs');

alt.on('playerConnect', player => {
    alt.log(`${player.name} has connected.`);

    // Setup chat functionality from Chat-Extended
    chat.setupPlayer(player);

    // Teleport player to location for the time being.
    player.pos = RegisterCamPoint;
    alt.emitClient(
        player,
        'registerShowCamera',
        RegisterCamPoint,
        RegisterCamDirection
    );
});
