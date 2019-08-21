import * as alt from 'alt';

alt.log('Loaded: panels->panelstatus.mjs');

let isPanelOpen = false;
let PanelStatus = new Map();

PanelStatus.set('atm', false);
PanelStatus.set('registration', false);
PanelStatus.set('character', false);
PanelStatus.set('clothing', false);
PanelStatus.set('name', false);

alt.on('panel:SetStatus', (panelName, value) => {
    PanelStatus.set(panelName, value);
    if (value) {
        isPanelOpen = true;
    } else {
        isPanelOpen = false;
    }
});

export function getStatus(name) {
    return PanelStatus.get(name);
}

export function isAnyPanelOpen() {
    return isPanelOpen;
}
