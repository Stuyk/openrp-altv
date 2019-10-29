// These doors are only established; when you first run the server.
// The doors must be added manually after you run the server.
// GUID of -1 means that there is NO OWNER.
// Normal Doors Use -> prop_cntrdoor_ld_l

// Interiors
// Modern 1 - apa_v_mp_h_01_a - { x: -786.8663, y: 315.7642, z: 217.6385 }
// Modern 2 - apa_v_mp_h_01_c - { x:-786.9563, y: 315.6229, z: 187.9136 }
// Modern 3 - apa_v_mp_h_01_b - { x:-774.0126, y: 342.0428, z: 196.6864 }

export const Doors = [
    {
        guid: -1,
        enter: {
            position: {
                x: 8.257935523986816,
                y: -243.91233825683594,
                z: 51.860504150390625
            },
            doorPos: {
                x: 8.71374225616455,
                y: -243.2096405029297,
                z: 51.860504150390625
            },
            doorRot: 90,
            doorModel: 'prop_cntrdoor_ld_l'
        },
        exit: {
            position: { x: -786.8663, y: 315.7642, z: 217.6385 }
        },
        interior: 'apa_v_mp_h_01_a',
        lockstate: 0,
        isGarage: 0,
        salePrice: -1
    },
    {
        guid: -1,
        enter: {
            position: {
                x: 7.033519744873047,
                y: -244.52027893066406,
                z: 47.660640716552734
            },
            doorPos: {
                x: 9.50475025177002,
                y: -243.03976440429688,
                z: 47.72608947753906
            },
            doorRot: 159,
            doorModel: 'prop_cntrdoor_ld_l'
        },
        exit: {
            position: { x: -786.8663, y: 315.7642, z: 217.6385 }
        },
        interior: 'apa_v_mp_h_01_a',
        lockstate: 0,
        isGarage: 0,
        salePrice: -1
    },
    {
        guid: -1,
        enter: {
            position: {
                x: 2.3360719680786133,
                y: -241.22756958007812,
                z: 47.660640716552734
            },
            doorPos: {
                x: 3.069896697998047,
                y: -240.70018005371094,
                z: 47.80110549926758
            },
            doorRot: 159,
            doorModel: 'prop_cntrdoor_ld_l'
        },
        exit: {
            position: { x: -786.9563, y: 315.6229, z: 187.9136 }
        },
        interior: 'apa_v_mp_h_01_c',
        lockstate: 0,
        isGarage: 0,
        salePrice: -1
    }
];
