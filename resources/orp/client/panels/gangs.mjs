import * as alt from 'alt';
import { View } from '/client/utility/view.mjs';
import { showCursor } from '/client/utility/cursor.mjs';

alt.log('Loaded: client->panels->info.mjs');

const url = 'http://resource/client/html/gangs/index.html';
let webview;

// Show the webview for the player to type in their roleplay info.
export function showDialogue() {
    if (!webview) {
        webview = new View();
    }

    if (alt.Player.local.getMeta('viewOpen')) return;
    if (alt.Player.local.getSyncedMeta('dead')) return;
    if (alt.Player.local.getMeta('arrest')) return;

    alt.log('Gang View Open');

    // Setup Webview
    webview.open(url, true);
    webview.on('gang:Close', closeDialogue);
    webview.on('gang:Ready', ready);
    webview.on('gang:ChangeRankName', changeRankName);
    webview.on('gang:ChangeOwnership', changeOwnership);
    webview.on('gang:RankUp', rankUp);
    webview.on('gang:RankDown', rankDown);
    webview.on('gang:Remove', remove);
    webview.on('gang:ChangeGangName', changeGangName);
    webview.on('gang:LeaveAsMember', leaveAsMember);
    webview.on('gang:Create', gangCreate);
}

alt.on('meta:Changed', (key, value) => {
    if (key !== 'gang:Info') return;
    if (!webview) return;
    if (!webview.view) return;
    webview.view.focus();
    showCursor(true);
    ready();
});

function ready() {
    if (!webview) return;
    const gangInfo = alt.Player.local.getMeta('gang:Info');
    if (!gangInfo) {
        webview.close();
        return;
    }
    const parsedInfo = JSON.parse(gangInfo);

    /*
    Object.keys(parsedInfo).forEach(key => {
        webview.emit('gang:Ready', key, parsedInfo[key]);
    });
    */

    webview.emit('gang:Ready', gangInfo);

    const id = alt.Player.local.getSyncedMeta('id');
    const members = JSON.parse(parsedInfo.members);
    const member = members.find(member => member.id === id);
    if (!member) return;
    webview.emit('gang:SetRank', member.rank, id);
}

function closeDialogue() {
    if (!webview) return;
    webview.close();
}

function changeGangName(name) {
    alt.emitServer('gang:ChangeGangName', name);
}

function changeRankName(index, name) {
    alt.emitServer('gang:ChangeRankName', index, name);
}

function changeOwnership(memberID) {
    alt.emitServer('gang:ChangeOwnership', memberID);
}

function rankUp(memberID) {
    alt.emitServer('gang:RankUp', memberID);
}

function rankDown(memberID) {
    alt.emitServer('gang:RankDown', memberID);
}

function remove(memberID) {
    alt.emitServer('gang:Remove', memberID);
}

function leaveAsMember(memberID) {
    alt.emitServer('gang:LeaveAsMember', memberID);
}

function gangCreate(name) {
    alt.emitServer('gang:Create', name);
}
