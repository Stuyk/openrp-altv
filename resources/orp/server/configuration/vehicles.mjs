import * as alt from 'alt';

export const VehiclePriceType = {
    PublicService: 0,
    Utility: 0,
    Muscle: 280000,
    SUVs: 98000,
    Super: 280000,
    Sedans: 48000,
    Sports: 280000,
    Emergency: 0,
    Helicopters: 0,
    Military: 0,
    OffRoad: 34000,
    Vans: 16000,
    Bicycles: 480,
    Coupes: 48000,
    Commercial: 0,
    Industrials: 0,
    Planes: 520000,
    Motorcycles: 4800,
    Compacts: 8200,
    Boats: 84000
};

alt.onClient('fetch:VehiclePrices', player => {
    alt.emitClient(player, 'return:VehiclePrices', JSON.stringify(VehiclePriceType));
});
