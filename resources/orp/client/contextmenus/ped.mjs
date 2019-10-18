import * as alt from 'alt';
import * as native from 'natives';
import { appendContextItem, setContextTitle } from '/client/panels/hud.mjs';

alt.log('Loaded: client->contextmenus->ped.mjs');

alt.on('menu:Ped', ent => {
    if (alt.Player.local.getMeta('arrest')) return;
    const player = alt.Player.all.find(x => x.scriptID === ent);
    if (!player) return;

    const name = player.getSyncedMeta('name');
    let options = [
        {
            label: name
        }
    ];

    options = options.concat(arrestAddons(player));
    setContextTitle(name);
});

function arrestAddons(player) {
    const options = [];
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

    return options;
}
