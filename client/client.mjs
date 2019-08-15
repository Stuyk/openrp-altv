import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/serverEventRouting.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';
