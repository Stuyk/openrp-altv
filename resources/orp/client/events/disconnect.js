import * as alt from 'alt';
import * as native from 'natives';
import * as panelsCharacter from '/client/panels/character.js';

alt.log('Loaded: client->events->disconnect.js');

alt.on('disconnect', () => {
    native.destroyAllCams(true);
    native.displayRadar(true);
    native.renderScriptCams(false, false, 0, false, false);
    native.transitionFromBlurred(0);

    alt.emit('view:DestroyAll');

    // Cleanup Peds
    alt.emit('peds:Delete');
});
