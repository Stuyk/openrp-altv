import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/serverEventRouting.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';
import * as update from 'client/events/update.mjs';
import * as interactionsystem from 'client/systems/interactionsystem.mjs';
import * as clothing from 'client/customizers/clothing.mjs';

alt.on('keyup', key => {
    if (key === 'X'.charCodeAt(0)) {
        clothing.showDialogue();
    }
});

/*
{
Player_VARIATION_FACE = 0,
Player_VARIATION_HEAD = 1,
Player_VARIATION_HAIR = 2,
Player_VARIATION_TORSO = 3,
Player_VARIATION_LEGS = 4,
Player_VARIATION_HANDS = 5,
Player_VARIATION_FEET = 6,
Player_VARIATION_EYES = 7,
Undershirt = 8,
Player_VARIATION_TASKS = 9,
Player_VARIATION_TEXTURES = 10,
Player_VARIATION_Shirt = 11
};
*/
