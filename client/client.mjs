import * as alt from 'alt';
import * as native from 'natives';

alt.log('Loaded: client.mjs');

// Import the rest of the events.
import * as servereventrouting from 'client/serverEvents/serverEventRouting.mjs';
import * as connectioncomplete from 'client/events/connectionComplete.mjs';
import * as disconnect from 'client/events/disconnect.mjs';
import * as update from 'client/events/update.mjs';

//native.isPedComponentVariationValid(ped, componentId, drawableId, textureId);

// Gets the Hash Name of a component.
// GET_HASH_NAME_FOR_COMPONENT

// Get variants available for hash name
// _GET_VARIANTS_FOR_COMPONENT_COUNT

/*
let lastID = 0;

alt.log('hey');

alt.on('keydown', key => {
    if (key === 'I'.charCodeAt(0)) {
        lastID += 1;
        native.setPedComponentVariation(
            alt.Player.local.scriptID,
            11,
            lastID,
            0,
            0
        );

        
        native.getShopPedComponent(p0, p1)


        let hashName = native.getHashNameForComponent(
            alt.Player.local.scriptID,
            11,
            lastID,
            0
        ); // Top
        //alt.log(hashName);

        let [a, b, c, d] = native.getForcedComponent(
            hashName,
            3,
            undefined,
            undefined,
            undefined
        ); // Get component?

        alt.log(a);
        alt.log(b);
        alt.log(c);
        alt.log(d);
    }

    if (key === 'U'.charCodeAt(0)) {
        lastID -= 1;
        native.setPedComponentVariation(
            alt.Player.local.scriptID,
            8,
            lastID,
            0,
            0
        );
    }
});
*/

let longPresses = new Map();

alt.on('keydown', key => {
    if (key === 'K'.charCodeAt(0)) {
        longPresses.set(key, Date.now());
    }
});

alt.on('keyup', key => {
    if (longPresses.has(key)) {
        let startTime = longPresses[key];
        let timePressed = Date.now() - startTime;

        if (timePressed > 5000) {
            alt.log('Long press');
        } else {
            alt.log('Short press');
        }

        longPresses.delete(key);
    }
});
