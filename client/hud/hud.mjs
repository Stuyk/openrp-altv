import * as alt from 'alt';
import * as native from 'natives';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';
import * as utilityText from 'client/utility/text.mjs';

const font = 4;
const fontScale = 0.5;
const alignment = 1;
const lineHeight = native.getTextScaleHeight(fontScale, font);
const streetLineHeight = native.getTextScaleHeight(0.7, font);
let isMetric = false;
let minimap = getMinimapAnchor();
let zoneStreet = '';

let hudToDraw = [
    // Bottom
    {
        prefix: '~w~Cash: ~g~$',
        meta: 'cash',
        color: { r: 0, g: 0, b: 0, a: 255 }
    },
    // Top
    {
        prefix: '~w~Open~y~RP',
        color: { r: 0, g: 0, b: 0, a: 255 }
    }
];

// Thanks Tekku
function getMinimapAnchor() {
    let safezone = native.getSafeZoneSize();
    let safezone_x = 1.0 / 20.0;
    let safezone_y = 1.0 / 20.0;
    let aspect_ratio = native.getAspectRatio(0);
    let screenRes = native.getActiveScreenResolution(0, 0);
    let res_x = screenRes[1];
    let res_y = screenRes[2];
    let xscale = 1.0 / res_x;
    let yscale = 1.0 / res_y;
    let minimap = {};

    minimap.width = xscale * (res_x / (4 * aspect_ratio));
    minimap.height = yscale * (res_y / 5.674);
    minimap.left_x =
        xscale * (res_x * (safezone_x * (Math.abs(safezone - 1.0) * 10)));
    minimap.bottom_y =
        1.0 - yscale * (res_y * (safezone_y * (Math.abs(safezone - 1.0) * 10)));
    minimap.right_x = minimap.left_x + minimap.width;
    minimap.top_y = minimap.bottom_y - minimap.height;
    minimap.x = minimap.left_x;
    minimap.y = minimap.top_y;
    minimap.xunit = xscale;
    minimap.yunit = yscale;

    return minimap;
}

alt.setInterval(() => {
    minimap = getMinimapAnchor();
    isMetric = native.getProfileSetting(227) == 1;
    let [_unk, _street, _cross] = native.getStreetNameAtCoord(
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z
    );

    let zone = native.getLabelText(
        native.getNameOfZone(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z
        )
    );

    let streetName = native.getStreetNameFromHashKey(_street);
    zoneStreet = `~y~${zone} ~w~${streetName}`;
}, 500);

alt.on('update', () => {
    if (!alt.Player.local.getSyncedMeta('loggedin')) return;

    if (panelsPanelStatus.isAnyPanelOpen()) return;

    native.setUiLayer(99);
    // Right
    native.drawRect(
        minimap.x + minimap.width,
        minimap.bottom_y - minimap.height / 2,
        0.003,
        minimap.height,
        255,
        255,
        255,
        255
    );
    // Left
    native.drawRect(
        minimap.x,
        minimap.bottom_y - minimap.height / 2,
        0.003,
        minimap.height,
        255,
        255,
        255,
        255
    );
    // Bottom
    native.drawRect(
        minimap.x + minimap.width / 2,
        minimap.bottom_y,
        minimap.width,
        0.0045,
        255,
        255,
        255,
        255
    );
    // Top
    native.drawRect(
        minimap.x + minimap.width / 2,
        minimap.bottom_y - minimap.height,
        minimap.width,
        0.0045,
        255,
        255,
        255,
        255
    );

    hudToDraw.forEach((hudElem, index) => {
        if (!hudElem.meta) {
            utilityText.drawText2d(
                `${hudElem.prefix}`,
                minimap.x, // xPos
                minimap.y - lineHeight * (index + 2), // yPos
                fontScale,
                font,
                hudElem.color.r,
                hudElem.color.g,
                hudElem.color.b,
                hudElem.color.a,
                false,
                false,
                99,
                alignment
            );
            return;
        }

        if (alt.Player.local.getSyncedMeta(hudElem.meta) === null) return;

        utilityText.drawText2d(
            `${hudElem.prefix}${alt.Player.local.getSyncedMeta(hudElem.meta)}`,
            minimap.x, // xPos
            minimap.y - lineHeight * (index + 2), // yPos
            fontScale,
            font,
            hudElem.color.r,
            hudElem.color.g,
            hudElem.color.b,
            hudElem.color.a,
            false,
            false,
            99,
            alignment
        );
    });

    // Draw Speedometer
    if (native.isRadarEnabled() && !native.isRadarHidden()) {
        // Draw Street
        utilityText.drawText2d(
            zoneStreet,
            minimap.right_x + 0.02,
            minimap.bottom_y - 0.035 - streetLineHeight / 4,
            0.7,
            4,
            255,
            255,
            255,
            255,
            false,
            false,
            99,
            1
        );

        if (alt.Player.local.vehicle) {
            let speed = native.getEntitySpeed(
                alt.Player.local.vehicle.scriptID
            );
            let actualSpeed = `${(speed * (isMetric ? 3.6 : 2.236936)).toFixed(
                2
            )}${isMetric ? 'KM/H' : 'MPH'}`;
            utilityText.drawText2d(
                actualSpeed,
                minimap.right_x + 0.02,
                minimap.bottom_y - 0.07 - streetLineHeight / 4,
                0.7,
                4,
                255,
                255,
                255,
                255,
                false,
                false,
                99,
                1
            );
        }
    }
});
