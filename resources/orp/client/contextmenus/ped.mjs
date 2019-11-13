import * as alt from 'alt';
import * as native from 'natives';
import { appendContextItem, setContextTitle } from '/client/panels/hud.mjs';

alt.log('Loaded: client->contextmenus->ped.mjs');

alt.on('menu:Ped', ent => {
    if (alt.Player.local.getMeta('arrest')) return;
    const player = alt.Player.all.find(x => x.scriptID === ent);
    if (!player) return;

    const name = player.getSyncedMeta('name');
    arrestAddons(player);
    gangAddons(player);
    setContextTitle(name);
});

function gangAddons(player) {
    const options = [];
    const gangInfo = alt.Player.local.getMeta('gang:Info');
    if (!gangInfo) {
        return options;
    }

    const parsedInfo = JSON.parse(gangInfo);
    const members = JSON.parse(parsedInfo.members);
    const member = members.find(
        member => member.id === alt.Player.local.getSyncedMeta('id')
    );

    if (!member) {
        return options;
    }

    if (member.rank >= 2) {
        appendContextItem('Invite to Gang', true, 'gang:InviteMember', { player });
    }
}

function arrestAddons(player) {
    const isTazed = player.getSyncedMeta('tazed');
    const arrester = player.getSyncedMeta('arrested');

    let isArrestable = false;
    const arrestAnim1 = native.isEntityPlayingAnim(
        player.scriptID,
        'random@mugging3',
        'handsup_standing_base',
        3
    );
    if (arrestAnim1 && !isTazed) {
        isArrestable = true;
    }

    const arrestAnim2 = native.isEntityPlayingAnim(
        player.scriptID,
        'random@arrests',
        'kneeling_arrest_idle',
        3
    );
    if (arrestAnim2 && !isTazed) {
        isArrestable = true;
    }

    // Is arrestable based on animations.
    if (isArrestable) {
        appendContextItem('Cuff', true, 'use:CuffPlayer', { player });
        appendContextItem('Cuff (Move Freely)', true, 'use:CuffPlayerFreely', { player });
        appendContextItem('Frisk', true, 'use:FriskPlayer', { player });
    }

    // Are uncuffable by person who cuffed them.
    if (arrester) {
        if (arrester.scriptID === alt.Player.local.scriptID) {
            appendContextItem('Uncuff', true, 'use:UncuffPlayer', { player });
            appendContextItem('Frisk', true, 'use:FriskPlayer', { player });
        }
    }

    // Is Tazed by Not Arrested Yet
    if (isTazed && !arrester) {
        appendContextItem('Cuff', true, 'use:CuffPlayer', { player });
        appendContextItem('Cuff (Move Freely)', true, 'use:CuffPlayerFreely', { player });
    }
}
