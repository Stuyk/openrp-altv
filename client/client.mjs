/* eslint-disable no-unused-vars */
import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import Events that need to be imported.
// Importing these pretty much imports the rest.
import * as serverEvents from 'client/serverEvents/events.mjs';
import * as eventsConnectionComplete from 'client/events/connectionComplete.mjs';
import * as eventsDisconnect from 'client/events/disconnect.mjs';
import * as eventsUpdate from 'client/events/update.mjs';
import * as eventsKeyup from 'client/events/keyup.mjs';
import * as systemsInteraction from 'client/systems/interaction.mjs';
import * as systemsClothing from 'client/systems/clothing.mjs';
import * as systemsWeather from 'client/systems/weather.mjs';
import * as utilitySandbox from 'client/utility/sandbox.mjs';
import * as hud from 'client/hud/hud.mjs';
