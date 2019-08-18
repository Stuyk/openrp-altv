import * as alt from 'alt';
import * as interactions from '../systems/interactionsystem.mjs';
import * as clothingList from '../configuration/clothing.mjs';

console.log('Loaded: interactions->clothing.mjs');

const clothingStores = [];

// Go through the ATM Configuration List
// Create a Interaction for each one.
// Put them into the above list.
// We also subtract 1 from the z position to ensure
// that the player is not below the point.
for (let i = 0; i < clothingList.Clothing.length; i++) {
    let pos = clothingList.Clothing[i];
    pos.z -= 1;

    // position, type, serverEventName, radius, height
    let res = new interactions.Interaction(
        pos,
        'clothing', // type
        'clothing:ShowDialogue', // The event to call when the player presses 'E'.
        2,
        3
    );

    clothingStores.push(res);
}

alt.on('clothing:ShowDialogue', player => {
    player.showClothingDialogue();
});

// We go through the atm list; create a blip for each one.
// This is called when the player joins the server.
export function synchronizeBlips(player) {
    clothingStores.forEach(element => {
        player.createBlip(element.pos, 73, 8, 'Clothing Store');
    });
}
