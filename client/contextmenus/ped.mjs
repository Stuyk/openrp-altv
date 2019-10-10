import * as alt from 'alt';
import * as native from 'natives';
import { ContextMenu } from '/client/systems/context.mjs';

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
    new ContextMenu(ent, options);
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
        options.push({
            label: 'Cuff',
            isServer: true,
            event: 'use:CuffPlayer'
        });
    }

    // Are uncuffable by person who cuffed them.
    if (arrester) {
        if (arrester.scriptID === alt.Player.local.scriptID) {
            options.push({
                label: 'Uncuff',
                isServer: true,
                event: 'use:UncuffPlayer'
            });
        }
    }

    // Is Tazed by Not Arrested Yet
    if (isTazed && !arrester) {
        options.push({
            label: 'Cuff',
            isServer: true,
            event: 'use:CuffPlayer'
        });
    }

    return options;
}
