import * as alt from 'alt';
import * as native from 'natives';

alt.on('gameEntityCreate', entity => {
    if (entity.constructor.name === 'Player') {
        if (entity.getSyncedMeta(`prop:37`)) {
            alt.setTimeout(() => {
                setupSlot(37, entity, entity.getSyncedMeta(`prop:37`));
            }, 250);
        }
    }
});

alt.on('gameEntityDestroy', entity => {
    if (entity.constructor.name === 'Player') {
        if (entity.getSyncedMeta(`prop:37`)) {
            const previous = entity.getMeta(`prop:37`);
            if (previous) {
                native.deleteObject(previous);
            }
        }
    }
});

alt.on('syncedMetaChange', (entity, key, value) => {
    if (!key.includes('prop')) return;
    const [_, _slot] = key.split(':');
    setupSlot(parseInt(_slot), entity, value);
});

function setupSlot(propID, entity, value) {
    const previous = entity.getMeta(`prop:${propID}`);
    if (previous) {
        native.deleteObject(previous);
        entity.setMeta(`prop:${propID}`, null);
    }

    if (!value) return;

    const object = native.createObject(
        native.getHashKey(value.name),
        0,
        0,
        0,
        true,
        true,
        true
    );
    native.attachEntityToEntity(
        object,
        entity.scriptID,
        native.getPedBoneIndex(entity.scriptID, value.bone),
        value.x,
        value.y,
        value.z,
        value.pitch,
        value.roll,
        value.yaw,
        true,
        true,
        false,
        true,
        1,
        true
    );
    entity.setMeta(`prop:${propID}`, object);
}

alt.onServer('tryprop', (prop, bone, x, y, z, pitch, roll, yaw) => {
    const object = native.createObject(
        native.getHashKey(prop),
        0,
        0,
        0,
        true,
        true,
        true
    );
    native.attachEntityToEntity(
        object,
        alt.Player.local.scriptID,
        native.getPedBoneIndex(alt.Player.local.scriptID, bone),
        x,
        y,
        z,
        pitch,
        roll,
        yaw,
        true,
        true,
        false,
        true,
        1,
        true
    );

    alt.setTimeout(() => {
        native.deleteEntity(object);
    }, 5000);
});
