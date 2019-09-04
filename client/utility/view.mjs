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

        currentView.view.url = url;
        currentView.view.isVisible = true;
        currentView.view.focus();
        currentView.focused = true;
        currentView.ready = true;
        showCursor(true);
        native.displayRadar(false);
        if (killControls) {
            alt.toggleGameControls(false);
        }
        return currentView;
    }

    // Close view and hide.
    close() {
        if (!currentView.ready) return;
        currentView.focused = false;
        currentView.view.url = 'http://resource/client/html/empty/index.html';
        currentView.view.unfocus();
        currentView.view.isVisible = false;
        currentView.ready = false;
        showCursor(false);
        alt.toggleGameControls(true);
        native.displayRadar(true);
    }

    // Check if the view is focused.
    isFocused() {
        return currentView.focused;
    }

    // Bind on events, but don't turn off.
    on(name, func) {
        if (currentView.events.has(name)) return;
        currentView.events.set(name, func);
        currentView.view.on(name, func);
    }

    emit(name, ...args) {
        currentView.view.emit(name, ...args);
    }
}
