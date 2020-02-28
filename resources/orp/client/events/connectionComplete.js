import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->events->connectionComplete.js');

let ready = false;
let loginAttempts = 0;
let maxAttempts = 120;

alt.on('connectionComplete', () => {
    alt.emitServer('connectionComplete');
    alt.emit('discord:Request');
    alt.log('Loading Interiors');
    alt.loadModel('mp_f_freemode_01');
    alt.loadModel('mp_m_freemode_01');
    alt.emit('load:Interiors');
    native.displayRadar(true);
    native.setMinimapComponent(15, true);
});
