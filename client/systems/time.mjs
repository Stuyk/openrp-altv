import * as alt from 'alt';

alt.log('Loaded: client->systems->time.mjs');

let currentHour = 8;

alt.on('syncedMetaChange', (entity, key, value) => {
    if (key !== 'time') return;

    currentHour = value;
});
