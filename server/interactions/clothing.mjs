import * as alt from 'alt';
import * as configurationClothing from '../configuration/clothing.mjs';

console.log('Loaded: interactions->clothing.mjs');

// Go through the ATM Configuration List
// Create a Interaction for each one.
// Put them into the above list.
// We also subtract 1 from the z position to ensure
// that the player is not below the point.
// Note: Probably not used anywhere. Might be useful for ADMIN PANEL in the future.
alt.on('clothing:ShowDialogue', player => {
    player.showClothingDialogue();
});

// We go through the atm list; create a blip for each one.
// This is called when the player joins the server.
export function synchronizeBlips(player) {
    for (let i = 0; i < configurationClothing.Locations.length; i++) {
        player.createBlip(configurationClothing.Locations[i], 73, 8, 'Clothing Store');
    }
}
