import * as alt from 'alt';
import * as native from 'natives';
import { View } from '/client/utility/view.js';
import { showCursor } from '/client/utility/cursor.js';
import { getLevel } from '/client/systems/xp.js';

alt.log('Loaded: client->panels->info.js');

const url = 'http://resource/client/html/factions/index.html';
let webview;

alt.on('consoleCommand', (cmd, ...args) => {
    if (cmd === 'f') {
        showDialogue();
    }
});

// Show the webview for the player to type in their roleplay info.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    // Setup Webview
    webview.open(url, true);
    webview.on('faction:Close', closeDialogue);
    webview.on('faction:Ready', ready);
    webview.on('faction:SaveRank', saveRank);
    webview.on('faction:SaveInfo', saveInfo);
    webview.on('faction:Kick', kick);
    webview.on('faction:RankUp', rankUp);
    webview.on('faction:RankDown', rankDown);
    webview.on('faction:Create', create);
    webview.on('faction:RemoveRank', removeRank);
    webview.on('faction:AppendRank', appendRank);
    webview.on('faction:SetFlags', setFlags);
    native.triggerScreenblurFadeIn(1000);

    alt.emit('hud:Hide', true);
    alt.emit('chat:Hide', true);
}

alt.on('meta:Changed', (key, value) => {
    if (key !== 'faction:Info') return;
    if (!webview) return;
    if (!webview.view) return;
    ready();
});

function ready() {
    if (!webview) return;
    showCursor(true);

    const factionInfo = alt.Player.local.getMeta('faction:Info');
    if (!factionInfo) {
        return;
    }

    const parsedInfo = JSON.parse(factionInfo);
    webview.emit('faction:Ready', factionInfo);
    const id = alt.Player.local.getSyncedMeta('id');
    const members = JSON.parse(parsedInfo.members);
    const member = members.find(member => member.id === id);

    if (!member) {
        return;
    }

    webview.emit('faction:SetMyData', member.rank, id);
}

function closeDialogue() {
    if (!webview) return;
    webview.close();
    native.triggerScreenblurFadeOut(1000);
    alt.emit('hud:Hide', false);
    alt.emit('chat:Hide', false);
}

function rankUp(memberID) {
    alt.emitServer('faction:RankUp', memberID);
}

function rankDown(memberID) {
    alt.emitServer('faction:RankDown', memberID);
}

function create(type, name) {
    alt.emitServer('faction:Create', type, name);
}

function kick(memberID) {
    alt.emitServer('faction:Kick', memberID);
}

function saveInfo(infoName, info) {
    alt.emitServer('faction:SetInfo', infoName, info);
}

function saveRank(index, rankName) {
    alt.emitServer('faction:SaveRank', index, rankName);
}

function removeRank(index) {
    alt.emitServer('faction:RemoveRank', index);
}

function appendRank(name) {
    alt.emitServer('faction:AppendRank', name);
}

function setFlags(index, flagValue) {
    alt.emitServer('faction:SetFlags', index, flagValue);
}

alt.onServer('faction:Error', msg => {
    if (!webview) {
        return;
    }

    webview.emit('faction:Error', msg);
});

alt.onServer('faction:Success', msg => {
    if (!webview) {
        return;
    }

    webview.emit('faction:Success', msg);
});
