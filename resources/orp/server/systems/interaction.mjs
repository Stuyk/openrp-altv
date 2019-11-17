import * as alt from 'alt';
import * as utilityVector from '../utility/vector.mjs';

export const interactions = [];

// Interactions act as a way for a user to simply press 'E'
// The event is then relayed to server-side and checks for an index.
// When the index is found the class executes the interaction.
// IndexValue is for special use cases. Such as jobs.
export class Interaction {
    constructor(position, type, serverEventName, radius, height, message, indexValue) {
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
        this.message = message;
        this.indexValue = indexValue;

        // Add to the interactions list.
        interactions.push(this);
    }

    // Add a blip
    addBlip(sprite, color, label, category = 'temporary') {
        this.blip = {
            position: this.pos,
            sprite,
            color,
            label,
            category
        };
    }

    // Call the server event from anywhere on the server-side.
    exec(player) {
        if (!player);
        if (utilityVector.distance(player.pos, this.pos) > this.radius) {
            player.emitMeta('interaction', undefined);
            return;
        }

        alt.emit(this.serverEventName, player, this.indexValue);
    }
}

// Synchronize Blips
export function syncBlips(player) {
    interactions.forEach(i => {
        if (!i.blip) return;
        player.createBlip(
            i.blip.category,
            i.blip.position,
            i.blip.sprite,
            i.blip.color,
            i.blip.label
        );
    });
}

// Forward the event for the colshape they just entered.
// This is called whenever the player enters any colshape.
// If the colshape doesn't belong to the list above;
// then the syncedMeta is not utilized here.
export function forwardEventToPlayer(colshape, entity) {
    let index = interactions.findIndex(x => x.colshape === colshape);

    if (index <= -1) return;

    entity.emitMeta('interaction', {
        index: index,
        message: interactions[index].message
    });
}

// Attempts to find the interaction; and executes it when the
// player hits the correct button. This is basically called
// after the player press 'E' and is standing in a ColShape.
export function attemptToExecuteInteraction(player) {
    if (!player) return;
    const data = player.getMeta('interaction');

    if (data === undefined || data === null) return;

    const index = data.index;

    if (interactions[index] === undefined) return;

    player.emitMeta('interaction', undefined);
    interactions[index].exec(player);
}

// Clear the interaction synced meta information.
export function clearInteraction(player) {
    if (!player) return;
    const data = player.getMeta('interaction');

    if (data === undefined || data === null) return;

    const index = data.index;

    if (interactions[index] === undefined) return;

    player.emitMeta('interaction', undefined);
}
