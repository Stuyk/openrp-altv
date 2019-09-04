import * as alt from 'alt';

alt.log('Loaded: client->systems->weather.mjs');

const weatherRotation = [
    0, // extra sunny
    1, // clear
    2, // clouds
    5, // overcast
    8, // light rain
    6, // rain
    7, // thunder
    8, // light rain
    5, // overcast
    2, // clouds
    0, // extra sunny
    0 // sunny
];

const weatherMultiplier = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

alt.setWeatherSyncActive(true);
alt.setWeatherCycle(weatherRotation, weatherMultiplier);
