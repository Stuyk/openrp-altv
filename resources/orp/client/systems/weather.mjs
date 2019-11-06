import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client->systems->weather.mjs');

const weather = {
    0: 'EXTRASUNNY', // icon
    1: 'CLEAR', // icon
    2: 'CLOUDS', // icon
    3: 'SMOG',
    4: 'FOGGY', // icon
    5: 'OVERCAST', // icon
    6: 'RAIN', // icon
    7: 'THUNDER', // icon
    8: 'CLEARING',
    9: 'NEUTRAL',
    10: 'SNOW',
    11: 'BLIZZARD',
    12: 'SNOWLIGHT',
    13: 'XMAS',
    14: 'HALLOWEEN'
};

alt.onServer('transition:Weather', weatherID => {
    if (!weather[weatherID]) {
        return;
    }
    native.setWeatherTypeOvertimePersist(weather[weatherID], 50);
    alt.emit('hud:UpdateWeather', weather[weatherID].toLowerCase());
});
