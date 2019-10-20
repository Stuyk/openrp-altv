import * as alt from 'alt';
import { Vehicles, VehiclePriceType } from '../configuration/vehicles.mjs';

let vendors = new Map();

alt.on('register:VehicleVendor', (vendor, index) => {
    vendors.set(`${index}`, vendor);
});

alt.on('vehicle:Vendor', (player, index) => {
    if (!vendors.has(`${index}`)) return;
    const vendor = vendors.get(`${index}`);
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

    player.addVehicle(name, player.vendor.exit, true);
}
