import * as alt from 'alt';
import * as vector from '../utility/vector.mjs';

console.log('Loaded: systems->interactionsystem.mjs');

export const interactions = [];

// Interactions act as a way for a user to simply press 'E'
// The event is then relayed to server-side and checks for an index.
// When the index is found the class executes the interaction.
export class Interaction {
    constructor(position, type, serverEventName, radius, height) {
        this.pos = position;
        this.type = type;
        this.serverEventName = serverEventName;
        this.colshape = new alt.ColshapeCylinder(
            this.pos.x,
            this.pos.y,
            this.pos.z,
            radius,
            height
        );

        // Add to the interactions list.
        interactions.push(this);
    }

    // Call the server event from anywhere on the server-side.
    exec(player) {
        if (vector.distance(player.pos, this.pos) > this.radius) {
            player.setSyncedMeta('interaction', undefined);
            return;
        }

        alt.emit(this.serverEventName, player);
    }
}

// Forward the event for the colshape they just entered.
// This is called whenever the player enters any colshape.
// If the colshape doesn't belong to the list above;
// then the syncedMeta is not utilized here.
export function forwardEventToPlayer(colshape, entity) {
    let interactionResult = interactions.findIndex(
        x => x.colshape === colshape
    );

    if (interactionResult <= -1) return;

    entity.setSyncedMeta('interaction', interactionResult);
}

// Attempts to find the interaction; and executes it when the
// player hits the correct button. This is basically called
// after the player press 'E' and is standing in a ColShape.
export function attemptToExecuteInteraction(player) {
    const interactionIndex = player.getSyncedMeta('interaction');

    if (interactionIndex === undefined || interactionIndex === null) return;

    if (interactions[interactionIndex] === undefined) return;

    player.setSyncedMeta('interaction', undefined);
    interactions[interactionIndex].exec(player);
}

// Clear the interaction synced meta information.
export function clearInteraction(player) {
    const interactionIndex = player.getSyncedMeta('interaction');

    if (interactionIndex === undefined || interactionIndex === null) return;

    if (interactions[interactionIndex] === undefined) return;

    player.setSyncedMeta('interaction', undefined);
}
