import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->events->connectionComplete.mjs');

alt.on('connectionComplete', () => {
    alt.emit('discord:Request');
    alt.log('Loading Interiors');
    alt.loadModel('mp_f_freemode_01');
    alt.loadModel('mp_m_freemode_01');
    alt.emit('load:Interiors');
    native.setMinimapComponent(15, true);
});
