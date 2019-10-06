import * as alt from 'alt';
import * as native from 'natives';
import { showCursor } from '/client/utility/cursor.mjs';

alt.log('Loaded: client->utility->view.mjs');

export let currentView;
export class View {
    constructor() {
        if (alt.Player.local.getMeta('chat')) return;
        if (currentView === undefined) {
            currentView = this;
        }
        return currentView;
    }

    open(url, killControls = true) {
        if (currentView.view) return;
        alt.Player.local.setMeta('viewOpen', true);
        alt.emit('chat:Toggle');
        currentView.view = new alt.WebView(url);
        currentView.events = [];
        currentView.on('close', currentView.close);
        currentView.view.url = url;
        currentView.view.isVisible = true;
        currentView.view.focus();
        currentView.ready = true;
        showCursor(true);
        native.displayRadar(false);
        if (killControls) {
            //currentView.gameControls = this.toggleGameControls.bind(this);
            //currentView.interval = alt.setInterval(currentView.gameControls, 0);
            alt.toggleGameControls(false);
        }
    }

    // Close view and hide.
    close() {
        if (!currentView.ready) return;
        currentView.ready = false;

        currentView.events.forEach(event => {
            currentView.view.off(event.name, event.func);
        });

        showCursor(false);
        native.displayRadar(true);
        currentView.view.off('close', currentView.close);
        currentView.view.unfocus();
        currentView.view.destroy();
        currentView.view = undefined;
        alt.Player.local.setMeta('viewOpen', false);
        alt.emit('chat:Toggle');
        alt.toggleGameControls(true);
        /*
        if (currentView.interval !== undefined) {
            alt.clearInterval(currentView.interval);
            currentView.interval = undefined;
        }
        */
    }

    // Bind on events, but don't turn off.
    on(name, func) {
        if (currentView.view === undefined) return;
        if (currentView.events.includes(event => event.name === name)) return;
        const event = {
            name,
            func
        };
        currentView.events.push(event);
        currentView.view.on(name, func);
    }

    emit(name, ...args) {
        if (!currentView.view) return;
        currentView.view.emit(name, ...args);
    }

    toggleGameControls() {
        native.disableAllControlActions(0);
        native.disableAllControlActions(1);
    }
}
