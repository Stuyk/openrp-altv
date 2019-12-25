import * as alt from 'alt';

fewfewfews;

const pedStreams = [];

export class PedStream {
    constructor(modelName, position, heading, menuTitle = '') {
        this.interactions = [];
        this.model = modelName;
        this.pos = position;
        this.heading = heading;
        this.title = menuTitle;
        pedStreams.push(this);
    }

    /**
     *
     * @param {Object} interaction
     * @param {String} interaction.name Title of the interaction in the menu
     * @param {Boolean} interaction.isServer Calls server-side function?
     * @param {String} interaction.eventName The event name to call.
     * @param {Object} interaction.data The data we should send up if necessary.
     */
    addInteraction(interaction) {
        this.interactions.push(interaction);
    }
}

alt.on('sync:Player', player => {
    const pedStreamJSON = JSON.stringify(pedStreams);
    alt.emitClient(player, 'pedstream:Append', pedStreamJSON);
});
