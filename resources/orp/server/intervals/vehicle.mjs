import * as alt from 'alt';

setInterval(() => {
    const filteredVehicles = alt.Vehicle.all.filter(x => x.driver);
    if (filteredVehicles.length <= 0) {
        return;
    }

    for (let i = 0; i < filteredVehicles.length; i++) {
        if (filteredVehicles[i].syncFuel) filteredVehicles[i].syncFuel();
    }
}, 15000);
