import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->events->connectionComplete.mjs');

alt.on('connectionComplete', () => {
    alt.log('Loading Interiors');

    alt.requestIpl('ex_dt1_02_office_02b');

    let coordLoc = native.getInteriorAtCoords(-141.1987, -620.913, 168.8205);
    alt.log(`Interior Location ID: ${coordLoc}`);

    native.loadInterior(coordLoc);
});

alt.onServer('startLogin', () => {
    let x = new alt.WebView(
        'http://resources/orp/client/html/splash/index.html'
    );

    x.focus();

    let interval = alt.setInterval(() => {
        x.focus();
    }, 500);

    x.on('done', () => {
        alt.clearInterval(interval);
        x.destroy();
        alt.emitServer('register:Ready');
    });

    x.emit('ready');
});
