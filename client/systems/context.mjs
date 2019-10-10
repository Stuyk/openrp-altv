import * as alt from 'alt';
import * as native from 'natives';
import * as utilityScreen2World from '/client/utility/screen2world.mjs';
import * as utilityText from '/client/utility/text.mjs';
import * as utilityVector from '/client/utility/vector.mjs';

alt.log('Loaded: client->systems->context.mjs');

let drawCursor = false;
let currentContext;
let cooldown = Date.now();
let lastRaycast = Date.now();
let rayCastInfo;

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

export class ContextMenu {
    constructor(entity, options, coords = undefined) {
        this.entity = entity;
        this.coords = coords;
        this.options = options;
        this.height = 0.04;
        this.width = 0.1;
        currentContext = this;
    }

    render() {
        if (this.options === undefined) return;
        native.setMouseCursorActiveThisFrame();
        let coords = this.coords
            ? this.coords
            : native.getEntityCoords(this.entity, false);
        this.options.forEach((item, index) => {
            const [_visible, _x, _y] = native.getScreenCoordFromWorldCoord(
                coords.x,
                coords.y,
                coords.z
            );

            if (!_visible) {
                return;
            }

            let yPos = _y + this.height * index;

            if (index === 0) {
                native.drawRect(
                    _x,
                    _y + this.height / 2,
                    this.width,
                    0.003,
                    0,
                    251,
                    255,
                    200
                );
            }

            if (this.isHovered(_x, yPos) && index >= 1) {
                native.setMouseCursorSprite(5);

                native.drawRect(
                    _x,
                    _y + this.height * index,
                    this.width,
                    this.height,
                    255,
                    255,
                    255,
                    150
                );
                utilityText.drawText2d(
                    item.label,
                    _x,
                    _y + this.height * index - this.height / 2,
                    0.5,
                    4,
                    0,
                    0,
                    0,
                    255,
                    false,
                    false,
                    99
                );

                if (native.isDisabledControlJustPressed(0, 24)) {
                    if (Date.now() < cooldown) return;

                    cooldown = Date.now() + 200;
                    this.execute(item);
                }
            } else {
                native.drawRect(
                    _x,
                    _y + this.height * index,
                    this.width,
                    this.height,
                    0,
                    0,
                    0,
                    150
                );
                utilityText.drawText2d(
                    item.label,
                    _x,
                    _y + this.height * index - this.height / 2,
                    0.5,
                    4,
                    219,
                    219,
                    219,
                    255,
                    false,
                    false,
                    99
                );
            }
        });
    }

    isHovered(x, y) {
        let mX = native.getControlNormal(0, 239);
        let mY = native.getControlNormal(0, 240);

        let width = this.width / 2;
        let height = this.height / 2;

        if (mX > x - width && mX < x + width && mY > y - height && mY < y + height) {
            return true;
        }

        return false;
    }

    execute(item) {
        if (item.event === undefined) return;

        currentContext = undefined;

        alt.setTimeout(() => {
            drawCursor = false;
        }, 200);

        if (item.isServer) {
            if (native.isEntityAVehicle(this.entity)) {
                let vehicle = alt.Vehicle.all.find(x => x.scriptID === this.entity);
                alt.emitServer(item.event, vehicle, item.data);
                return;
            }

            if (native.isEntityAPed(this.entity)) {
                let ped = alt.Player.all.find(x => x.scriptID === this.entity);
                alt.emitServer(item.event, ped, item.data);
                return;
            }

            alt.emitServer(item.event, item.data);
        } else {
            alt.emit(item.event, this.entity, item.data);
        }
    }
}

let interval;

export function showContext() {
    if (alt.Player.local.getMeta('viewOpen')) return;
    if (!interval) {
        interval = alt.setInterval(useMenu, 0);
        alt.log(`context.mjs ${interval}`);
    }
}

export function hideContext() {
    if (alt.Player.local.getMeta('viewOpen')) return;

    if (interval) {
        alt.clearInterval(interval);
        interval = undefined;
        currentContext = undefined;
        rayCastInfo = undefined;
    }
}

function useMenu() {
    if (alt.Player.local.getMeta('viewOpen')) {
        if (interval) {
            alt.clearInterval(interval);
            interval = undefined;
            currentContext = undefined;
            rayCastInfo = undefined;
        }
        return;
    }

    native.setMouseCursorSprite(1);

    if (currentContext !== undefined) {
        currentContext.render();
    }

    native.setMouseCursorActiveThisFrame();
    native.disableControlAction(0, 24, true); // Left Mouse
    native.disableControlAction(0, 25, true); // Right Mouse
    native.disableControlAction(0, 1, true);
    native.disableControlAction(0, 2, true);
    native.disablePlayerFiring(alt.Player.local.scriptID, false);

    if (rayCastInfo) {
        native.setMouseCursorSprite(3);
        if (native.isDisabledControlJustPressed(0, 25)) {
            if (Date.now() < cooldown) return;

            cooldown = Date.now() + 500;
            const entityType = native.getEntityType(rayCastInfo.entity);
            if (entityType === 0) return;

            alt.log(`You clicked on entity: ${rayCastInfo.entity}`);
            alt.log(`Entity has model of ${native.getEntityModel(rayCastInfo.entity)}`);
            alt.log(`Entity Type: ${entityType}`);

            let interaction = interactionTypes[entityType];

            if (interaction === undefined) return;
            drawCursor = false;
            currentContext = undefined;
            interaction.func(rayCastInfo.entity, rayCastInfo.endCoords);
            rayCastInfo = undefined;
        }
    } else {
        native.setMouseCursorSprite(1);
    }

    if (Date.now() > lastRaycast) {
        lastRaycast = Date.now() + 500;
        const [
            _,
            hit,
            endCoords,
            surfaceNormal,
            entity
        ] = utilityScreen2World.screenToWorld(22, -1);

        if (hit) {
            if (utilityVector.distance(alt.Player.local.pos, endCoords) < 5) {
                rayCastInfo = {
                    hit,
                    endCoords,
                    surfaceNormal,
                    entity
                };
            } else {
                rayCastInfo = undefined;
            }
        }
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
