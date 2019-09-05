import * as alt from 'alt';
import * as native from 'natives';
import { showCursor } from 'client/utility/cursor.mjs';

alt.log('Loaded: client->utility->view.mjs');

let isChatOpen = false;

alt.on('chat:IsOpen', value => {
    isChatOpen = value;
});

export let currentView;
export class View {
    constructor(url, killControls = true) {
        if (currentView === undefined) {
            currentView = this;
            currentView.view = new alt.WebView(url);
            currentView.events = new Map();
            currentView.on('close', currentView.close);
        }

        if (currentView.focused) return;
        if (isChatOpen) return;

        if (currentView.view === undefined) {
            currentView.view = new alt.WebView(url);
            currentView.events = new Map();
            currentView.on('close', currentView.close);
        }

        alt.emit('chat:Toggle');
        currentView.view.url = url;
        currentView.view.isVisible = true;
        currentView.view.focus();
        currentView.focused = true;
        currentView.ready = true;
        showCursor(true);
        native.displayRadar(false);
        if (killControls) {
            currentView.gameControls = this.toggleGameControls.bind(this);
            alt.on('update', currentView.gameControls);
        }
        return currentView;
    }

    // Close view and hide.
    close() {
        if (!currentView.ready) return;
        currentView.focused = false;
        currentView.ready = false;
        showCursor(false);
        native.displayRadar(true);

        Object.keys(currentView.events).forEach(key => {
            currentView.view.off(key, currentView.events[key]);
        });

        currentView.view.off('close', currentView.close);
        currentView.view.unfocus();
        currentView.view.destroy();
        currentView.view = undefined;
        alt.emit('chat:Toggle');
        alt.off('update', currentView.gameControls);
    }

    // Check if the view is focused.
    isFocused() {
        return currentView.focused;
    }

    // Bind on events, but don't turn off.
    on(name, func) {
        if (currentView.events.has(name)) return;
        const boundFunction = func.bind(this);
        currentView.events.set(name, boundFunction);
        currentView.view.on(name, boundFunction);
    }

    emit(name, ...args) {
        currentView.view.emit(name, ...args);
    }

    toggleGameControls() {
        native.disableAllControlActions(0);
        native.disableAllControlActions(1);
    }
}
