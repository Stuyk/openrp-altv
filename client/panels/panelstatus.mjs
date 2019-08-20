import * as alt from 'alt';

alt.log('Loaded: panels->panelstatus.mjs');

let PanelStatus = new Map();

PanelStatus.set('atm', false);
PanelStatus.set('registration', false);
PanelStatus.set('character', false);
PanelStatus.set('clothing', false);
PanelStatus.set('roleplayname', false);

alt.on('panel:SetStatus', (panelName, value) => {
    PanelStatus.set(panelName, value);
});

export function getStatus(name) {
    return PanelStatus.get(name);
}
