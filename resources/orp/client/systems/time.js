import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->time.js');

alt.onServer('time:SetTime', (hour, minute) => {
    native.pauseClock(true);
    alt.log(`Time: Hour: ${hour} || Minute: ${minute}`);
});
