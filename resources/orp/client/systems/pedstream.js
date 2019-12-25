import * as alt from 'alt';
import * as native from 'natives';
import { distance } from '/client/utility/vector.js';
import { appendContextItem, setContextTitle } from '/client/panels/hud.js';
import { loadAnim } from '/client/systems/animation.js';

/**
 * Creates Clickable Peds with Optional Context Options
 */
const renderDistance = 25;
const pedStreams = [];

alt.on('peds:Delete', () => {
    pedStreams.forEach(pedStream => {
        if (!pedStream.id) {
            return;
        }

        native.deleteEntity(pedStream.id);
    });
});

export class PedStream {
    constructor(hash, position, heading = 0) {
        this.scriptID = undefined;
        this.hash = hash;
        this.position = position;
        this.heading = heading;
        pedStreams.push(this);
    }

    // contextMenus:
    // [{ name: 'Use Phone', isServer: true, eventName: 'use:PayPhone', data: {}}];
    // contextTitle:
    // 'My Menu'
    addInteraction(contextMenus, contextTitle) {
        if (!Array.isArray(contextMenus)) {
            alt.log('Context menus provided are not an array.');
            return;
        }

        if (!contextTitle) {
            alt.log('Context title was not provided.');
            return;
        }

        this.contextMenus = contextMenus;
        this.contextTitle = contextTitle;
    }

    addIdleAnimation(dict, name) {
        this.idleAnimation = {
            dict,
            name
        };
    }

    addInteractAnimation(dict, name, duration) {
        this.interactAnimation = {
            dict,
            name,
            duration
        };
    }

    playAnimation(dict, name, duration = -1) {
        native.taskPlayAnim(
            this.scriptID,
            dict,
            name,
            1,
            -1,
            duration,
            1,
            1.0,
            false,
            false,
            false
        );
    }

    interact() {
        if (this.interactAnimation) {
            this.playAnimation(
                this.interactAnimation.dict,
                this.interactAnimation.name,
                this.interactAnimation.duration
            );
        }

        native.taskTurnPedToFaceEntity(this.scriptID, alt.Player.local.scriptID, 5000);
        this.contextMenus.forEach(menu => {
            appendContextItem(menu.name, menu.isServer, menu.eventName, menu.data);
        });

        setContextTitle(this.contextTitle);
    }

    render() {
        const dist = distance(this.position, alt.Player.local.pos);
        if (dist >= renderDistance) {
            this.destroy();
            return;
        }
        this.create();
    }

    destroy() {
        if (!this.scriptID) {
            return;
        }

        native.deleteEntity(this.scriptID);
        this.scriptID = undefined;
    }

    create() {
        if (this.scriptID) {
            const dist = distance(
                this.position,
                native.getEntityCoords(this.scriptID, false)
            );
            if (dist <= 2) {
                return;
            }

            native.deleteEntity(this.scriptID);
        }

        this.scriptID = native.createPed(
            1,
            this.hash,
            this.position.x,
            this.position.y,
            this.position.z - 0.4,
            this.heading,
            false,
            false
        );
        native.taskSetBlockingOfNonTemporaryEvents(this.scriptID, 1);
        native.setBlockingOfNonTemporaryEvents(this.scriptID, 1);
        native.setPedFleeAttributes(this.scriptID, 0, 0);
        native.setPedCombatAttributes(this.scriptID, 17, 1);
        native.setEntityInvincible(this.scriptID, true);
        alt.setTimeout(() => {
            if (this.scriptID) {
                // Handle Animation
                if (!this.idleAnimation) {
                    return;
                }

                const loadAnimation = loadAnim(dict);
                loadAnimation.then(() => {
                    this.playAnimation(
                        this.idleAnimation.dict,
                        this.idleAnimation.name,
                        -1
                    );
                });
            }
        }, 1000);
    }
}

alt.setInterval(() => {
    if (pedStreams.length <= 0) return;
    pedStreams.forEach(pedStream => {
        pedStream.render();
    });
}, 1500);

alt.on('pedStream:Interact', id => {
    const index = pedStreams.findIndex(pedStream => {
        if (pedStream.scriptID === id) {
            return pedStream;
        }
    });

    if (index <= -1) {
        alt.log('Ped stream could not be found.');
        return;
    }

    pedStreams[index].interact();
});

alt.onServer('pedstream:Append', pedJson => {
    const data = JSON.parse(pedJson);
    if (!data) {
        return;
    }

    if (data.length <= 0) {
        return;
    }

    data.forEach(stream => {
        const hash = native.getHashKey(stream.model);
        native.requestModel(hash);
        alt.loadModel(hash);

        const newPedStream = new PedStream(hash, stream.pos, stream.heading);

        newPedStream.addInteraction(stream.interactions, stream.title);
        alt.log('PedStrema was created');
    });
});
