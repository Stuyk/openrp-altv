import * as alt from 'alt';
import * as native from 'natives';
import { appendContextItem, setContextTitle } from '/client/panels/hud.js';
import { isFlagged } from '/client/utility/flags.js';

alt.log('Loaded: client->contextmenus->ped.js');

const objectInteractions = {
    2627665880: {
        func: player
    },
    1885233650: {
        func: player
    }
};

alt.on('menu:Ped', ent => {
    if (alt.Player.local.getMeta('arrest')) return;
    const model = native.getEntityModel(ent);

    if (!alt.Player.local.vehicle) {
        const running = native.isPedRunning(alt.Player.local.scriptID);
        const walking = native.isPedWalking(alt.Player.local.scriptID);
        if (!running && !walking) {
            native.taskTurnPedToFaceEntity(alt.Player.local.scriptID, ent, 1000);
        }
    }

    let interaction = objectInteractions[model];
    if (interaction === undefined || interaction.func === undefined) {
        alt.emit('pedStream:Interact', ent);
        return;
    }

    interaction.func(ent);
});

function player(ent) {
    const player = alt.Player.all.find(x => x.scriptID === ent);
    if (!player) return;

    const name = player.getSyncedMeta('name');
    tradeAddons(player);
    arrestAddons(player);
    gangAddons(player);
    setContextTitle(name);
}

function gangAddons(player) {
    const options = [];
    const factionInfo = alt.Player.local.getMeta('faction:Info');
    if (!factionInfo) {
        return options;
    }

    alt.log('Is in faction.');

    const faction = JSON.parse(factionInfo);
    const members = JSON.parse(faction.members);
    const member = members.find(
        member => member.id === alt.Player.local.getSyncedMeta('id')
    );

    if (!member) {
        return options;
    }

    alt.log('is member');

    const ranks = JSON.parse(faction.ranks);
    if (!isFlagged(ranks[member.rank].flags, 1)) {
        return options;
    }

    appendContextItem('Invite to Faction', true, 'faction:InviteMember', { player });
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

function tradeAddons(player) {
    const playerTradeOffer = alt.Player.local.getMeta('trade');
    if (playerTradeOffer) {
        appendContextItem('Accept Trade', true, 'trade:Offer', { target: player });
    } else {
        appendContextItem('Offer to Trade', true, 'trade:Offer', { target: player });
    }
}
