import * as alt from 'alt';
import * as native from 'natives';
import * as utilityScreen2World from '/client/utility/screen2world.js';
import * as utilityText from '/client/utility/text.js';
import * as utilityVector from '/client/utility/vector.js';
import { showCursor } from '/client/utility/cursor.js';

alt.log('Loaded: client->systems->context.js');

let clickCooldown = Date.now();
let rayCastInfo;
let lastRayCast = Date.now();
let endPoint;

let interactionTypes = {
    0: {
        func: mapMenu
    },
    1: {
        func: pedMenu
    },
    2: {
        func: vehMenu
    },
    3: {
        func: objMenu
    }
};

let interval;

export function showContext() {
    if (alt.Player.local.getMeta('viewOpen')) return;
    if (!interval) {
        interval = alt.setInterval(useMenu, 0);
        alt.log(`context.js ${interval}`);
        alt.emit('hud:ContextClose');
        showCursor(true);
    }
}

export function hideContext() {
    if (alt.Player.local.getMeta('viewOpen')) return;

    if (interval) {
        alt.clearInterval(interval);
        interval = undefined;
        rayCastInfo = undefined;
        endPoint = undefined;
        showCursor(false);
    }

    alt.emit('hud:ContextClose');
}

function useMenu() {
    if (alt.Player.local.getMeta('viewOpen') || alt.Player.local.getSyncedMeta('dead')) {
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
            rayCastInfo = undefined;
            endPoint = undefined;
            alt.emit('hud:ContextClose');
            showCursor(false);
        }
        return;
    }

    if (endPoint) {
        native.drawLine(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z,
            endPoint.x,
            endPoint.y,
            endPoint.z,
            255,
            255,
            255,
            100
        );
    }

    native.disableControlAction(0, 24, true); // Left Mouse
    native.disableControlAction(0, 25, true); // Right Mouse
    native.disableControlAction(0, 1, true);
    native.disableControlAction(0, 2, true);
    native.disablePlayerFiring(alt.Player.local.scriptID, false);

    if (Date.now() > lastRayCast) {
        lastRayCast = Date.now() + 100;
        const [
            _,
            hit,
            endCoords,
            surfaceNormal,
            entity
        ] = utilityScreen2World.screenToWorld(22, -1);

        if (!hit) {
            rayCastInfo = undefined;
            endPoint = undefined;
            return;
        }

        const entityType = native.getEntityType(entity);
        if (entityType === 0) {
            rayCastInfo = undefined;
            endPoint = undefined;
            return;
        }

        rayCastInfo = {
            hit,
            endCoords,
            surfaceNormal,
            entity,
            entityType
        };
        endPoint = endCoords;
    }

    if (!rayCastInfo) return;
    if (native.isDisabledControlJustPressed(0, 25)) {
        if (Date.now() < clickCooldown) return;
        clickCooldown = Date.now() + 100;

        if (utilityVector.distance(alt.Player.local.pos, rayCastInfo.endCoords) > 5)
            return;

        const model = native.getEntityModel(rayCastInfo.entity);
        alt.log(`Entity ID: ${rayCastInfo.entity}, Model: ${model}`);

        let interaction = interactionTypes[rayCastInfo.entityType];
        if (interaction === undefined) return;
        alt.emit('hud:ContextClose');
        interaction.func(rayCastInfo.entity, rayCastInfo.endCoords);
        rayCastInfo = undefined;
    }
}

// Don't remove this.
function mapMenu(ent, coords) {
    // Do nothing
}

function pedMenu(ent, coords) {
    if (ent === alt.Player.local.scriptID) {
        alt.emit('menu:Player', ent);
        return;
    } else {
        alt.emit('menu:Ped', ent);
        return;
    }
}

function objMenu(ent, coords) {
    alt.emit('menu:Object', ent);
}

function vehMenu(ent) {
    alt.emit('menu:Vehicle', ent);
}
