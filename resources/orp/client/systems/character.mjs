import * as alt from 'alt';
import * as native from 'natives';
import { HairOverlaysMale, HairOverlaysFemale } from '/client/gamedata/headOverlays.mjs';

alt.log('Loaded: client->systems->character.mjs');

alt.on('meta:Changed', (key, value) => {
    if (!key.includes('group')) return;
    syncFace(key, value);
});

let playerModel = 0;

// Synchronize the clothing sent down from the server.
export function syncClothing(jsonData) {
    const result = JSON.parse(jsonData);

    if (result === null) return;

    result.forEach(item => {
        if (!item.isProp) {
            native.setPedComponentVariation(
                alt.Player.local.scriptID,
                item.id,
                item.value,
                item.texture,
                0
            );
        } else {
            if (item.value === -1) {
                native.clearPedProp(alt.Player.local.scriptID, item.id);
            }

            native.setPedPropIndex(
                alt.Player.local.scriptID,
                item.id,
                item.value,
                item.texture,
                false
            );
        }
    });
}

// Apply all of the facial data to the player.
export function syncFace(groupName, json) {
    if (!json) return;
    const data = JSON.parse(json);
    if (!data) return;

    // Set all to zero to prevent bugs.
    native.clearPedBloodDamage(alt.Player.local.scriptID);

    if (groupName === 'facegroup') {
        native.setPedHeadBlendData(
            alt.Player.local.scriptID,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            false
        );

        native.setPedHeadBlendData(
            alt.Player.local.scriptID,
            data[0].value,
            data[1].value,
            0,
            data[2].value,
            data[3].value,
            0,
            data[4].value,
            data[5].value,
            0,
            false
        );
        return;
    }

    if (groupName === 'sexgroup') {
        playerModel = data[0].value;
    }

    if (groupName === 'structuregroup') {
        data.forEach(structure => {
            native.setPedFaceFeature(
                alt.Player.local.scriptID,
                structure.id,
                structure.value
            );
        });
        return;
    }

    if (groupName === 'hairgroup') {
        native.clearPedDecorations(alt.Player.local.scriptID);

        const decor =
            playerModel === 0
                ? HairOverlaysFemale[data[0].value]
                : HairOverlaysMale[data[0].value];

        if (decor) {
            const collection = native.getHashKey(decor.collection);
            const overlay = native.getHashKey(decor.overlay);
            native.addPedDecorationFromHashes(
                alt.Player.local.scriptID,
                collection,
                overlay
            );
        }

        native.setPedComponentVariation(
            alt.Player.local.scriptID,
            2,
            data[0].value,
            data[3].value,
            0
        );
        native.setPedHairColor(alt.Player.local.scriptID, data[1].value, data[2].value);
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            1,
            data[4].value,
            data[5].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            1,
            1,
            data[6].value,
            data[7].value
        );
        return;
    }

    if (groupName === 'eyesgroup') {
        native.setPedEyeColor(alt.Player.local.scriptID, data[0].value);
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            2,
            data[1].value,
            data[2].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            2,
            1,
            data[3].value,
            data[4].value
        );
        return;
    }

    if (groupName === 'makeupgroup') {
        // Makeup
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            4,
            data[0].value,
            data[1].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            4,
            2,
            data[2].value,
            data[3].value
        );

        // Blush
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            5,
            data[4].value,
            data[5].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            5,
            2,
            data[6].value,
            data[6].value
        );

        // Lipstick
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            8,
            data[7].value,
            data[8].value
        );
        native.setPedHeadOverlayColor(
            alt.Player.local.scriptID,
            8,
            2,
            data[9].value,
            data[10].value
        );
        return;
    }

    if (groupName === 'detailgroup') {
        let lastValue = 0;
        data.forEach((detail, index) => {
            if (index === 0 || index % 2 === 0) {
                lastValue = detail.value;
                return;
            }

            native.setPedHeadOverlay(
                alt.Player.local.scriptID,
                detail.id,
                lastValue,
                detail.value
            );
        });
        return;
    }

    if (groupName === 'tattoogroup') {
        data.forEach(tatData => {
            const tattooData = tatData.tattoo.split('@');
            const collection = native.getHashKey(tattooData[0]);
            const overlay = native.getHashKey(tattooData[1]);
            native.addPedDecorationFromHashes(
                alt.Player.local.scriptID,
                collection,
                overlay
            );
        });
        return;
    }
}
