import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/serverEventRouting.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';
import * as update from 'client/events/update.mjs';
import * as interactionsystem from 'client/systems/interaction.mjs';
import * as clothing from 'client/customizers/clothing.mjs';

native.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
