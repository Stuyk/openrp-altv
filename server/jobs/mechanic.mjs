export const job = () => {
    return [
        {
            name: 'Mechanic Shop',
            guid: 'mechanic', // used for special scripts.
            blipSprite: 566,
            blipColor: 26,
            required: [{ name: 'Drivers License', inInventory: true }],
            start: {
                x: 537.7582397460938,
                y: -182.4659423828125,
                z: 53.4366455078125
            },
            points: [
                {
                    name: 'Retrieve Truck',
                    type: 'spawnvehicle',
                    reward: 0,
                    blipSprite: 225,
                    blipColor: 1,
                    vehicle: {
                        model: 'burrito3',
                        lockState: 1, // 1 for unlocked. 2 for locked.
                        preventHijack: true
                    },
                    markerType: 1,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 530.4395751953125,
                        y: -189.11209106445312,
                        z: 52.5941162109375
                    },
                    height: 0.75,
                    range: 2
                },
                {
                    name: 'Infinite',
                    type: 'infinite'
                },
                {
                    name: 'Wait for Mechanic request',
                    type: 'target',
                    message: 'Wait for your next customer...'
                },
                {
                    name: 'Repair',
                    type: 'targetrepair',
                    message: 'Use ~INPUT_CONTEXT~ to repair; after arrival.',
                    anim: {
                        dict: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
                        name: 'weed_crouch_checkingleaves_idle_01_inspector',
                        duration: -1,
                        flag: 129
                    },
                    range: 7,
                    fare: true,
                    progressMax: 75
                }
            ]
        }
    ];
};
