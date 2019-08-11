import * as alt from 'alt';
import * as native from 'natives';

alt.log('OnDisconnect Loaded');

alt.on('disconnect', () => {
    native.destroyAllCams(true);
    native.displayRadar(true);
    native.renderScriptCams(false, false, 0, false, false);
    native.transitionFromBlurred(0);
});
