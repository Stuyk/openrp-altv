/* eslint-disable no-unused-vars */
import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

native.doScreenFadeOut(1);

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/events.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';
import * as update from 'client/events/update.mjs';
import * as eventsKeyup from 'client/events/keyup.mjs';

import * as systemsInteraction from 'client/systems/interaction.mjs';
import * as systemsInventory from 'client/systems/inventory.mjs';
import * as systemsClothing from 'client/systems/clothing.mjs';
import * as systemsWeather from 'client/systems/weather.mjs';
import * as systemsJob from 'client/systems/job.mjs';

import * as clothing from 'client/customizers/clothing.mjs';

import * as utilitySandbox from 'client/utility/sandbox.mjs';

import * as hud from 'client/hud/hud.mjs';

native.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');

alt.setTimeout(() => {
    native.doScreenFadeIn(5000);
}, 10000);
