import * as alt from 'alt';
import { Vehicles, VehiclePriceType } from '../configuration/vehicles.mjs';
import { Vendors } from '../configuration/vendors.mjs';
import { Interaction } from '../systems/interaction.mjs';

let vendors = {};

export function registerVehicleVendor(vendor, index) {
    vendors[index] = vendor;
}

alt.on('vehicle:Vendor', (player, index) => {
    if (!vendors[index]) return;
    const vendor = vendors[index];
    alt.log('Got Vendor');

    alt.emitClient(
        player,
        'vehiclevendor:ShowDialogue',
        vendor.pos,
        vendor.cPos,
        vendor.type
    );
    player.vendor = vendor;
});

export function purchaseVehicle(player, name) {
    const veh = Vehicles.find(veh => veh.sell && veh.name === name);
    if (!veh) {
        player.notify('That vehicle is not available.');
        return;
    }

    const price = VehiclePriceType[veh.class];
    if (!price) {
        player.notify('That vehicle is not available.');
        return;
    }

    if (!player.hasVehicleSlot()) {
        player.notify('You are out of vehicle slots.');
        return;
    }

    if (player.getCash() < price) {
        player.notify('You do not have enough money.');
        return;
    }

    if (!player.subCash(price)) {
        player.notify('You do not have enough money.');
        return;
    }

    player.addVehicle(name, player.vendor.exit, 0);
}

Vendors.forEach((vendor, index) => {
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
        registerVehicleVendor(vendor, index);
    }
});
