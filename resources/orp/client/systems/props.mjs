import * as alt from 'alt';
import * as native from 'natives';

alt.on('gameEntityCreate', entity => {
    if (entity.constructor.name === 'Player') {
        if (entity.getSyncedMeta(`prop:11`)) {
            alt.setTimeout(() => {
                setupSlot(11, entity, entity.getSyncedMeta(`prop:11`));
            }, 250);
        }

        if (entity.getSyncedMeta(`job:Props`)) {
            handleJobProps(entity, entity.getSyncedMeta('job:props'));
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

        handleJobProps(entity, undefined);
    }
});

alt.on('syncedMetaChange', (entity, key, value) => {
    if (key === 'job:Props') {
        handleJobProps(entity, value);
        return;
    }

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

function handleJobProps(entity, props) {
    if (!props) {
        if (!entity.getMeta('job:Props')) return;

        entity.getMeta('job:Props').forEach(prop => {
            native.deleteEntity(prop);
        });

        entity.setMeta('job:Props', undefined);
    } else {
        const newProps = [];
        props.forEach(prop => {
            const object = native.createObject(
                native.getHashKey(prop.name),
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
                native.getPedBoneIndex(entity.scriptID, prop.bone),
                prop.x,
                prop.y,
                prop.z,
                prop.pitch,
                prop.roll,
                prop.yaw,
                true,
                true,
                false,
                true,
                1,
                true
            );
            newProps.push(object);
        });
        entity.setMeta('job:Props', newProps);
    }
}
