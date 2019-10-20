import * as alt from 'alt';
import { Interaction } from '../systems/interaction.mjs';

export const vendors = [
    {
        base: 'vehicle',
        type: 'sportclassic',
        interaction: {
            x: -39.03110885620117,
            y: -1100.61474609375,
            z: 26.42235565185547
        },
        pos: { x: -42.8653564453125, y: -1093.984619140625, z: 26.422344207763672 },
        cPos: { x: -45.1474723815918, y: -1100.4794921875, z: 27.422344207763672 },
        exit: { x: -69.21147155761719, y: -1099.0828857421875, z: 26.305255889892578 },
        blip: {
            name: 'Premium Deluxe Motorsport',
            sprite: 147,
            color: 11
        }
    }
];

vendors.forEach((vendor, index) => {
    // Vehicle Vendors
    if (vendor.base === 'vehicle') {
        let interactionPoint = { ...vendor.interaction };
        interactionPoint.z -= 0.5;
        let interaction = new Interaction(
            interactionPoint,
            'vendor',
            'vehicle:Vendor',
            3,
            3,
            'to browse the vehicle lot.',
            index
        );
        interaction.addBlip(vendor.blip.sprite, vendor.blip.color, vendor.blip.name);
        alt.emit('register:VehicleVendor', vendor, index);
    }
});
