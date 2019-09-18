export const job = () => {
    return [
        {
            name: 'Taxi Station',
            guid: 'taxi', // used for special scripts.
            blipSprite: 56,
            blipColor: 5,
            required: [{ name: 'Drivers License', inInventory: true }],
            start: {
                x: 895.7274780273438,
                y: -179.56483459472656,
                z: 73.6900634765625
            },
            points: [
                {
                    name: 'Retrieve Taxi',
                    type: 'spawnvehicle',
                    reward: 0,
                    blipSprite: 225,
                    blipColor: 1,
                    vehicle: {
                        model: 'taxi',
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
                        x: 909.7714233398438,
                        y: -170.03076171875,
                        z: 73.15087890625
                    },
                    height: 0.75,
                    range: 2
                },
                {
                    name: 'Exit the Station',
                    type: 'drivepoint',
                    message: '',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 1,
                    markerType: 1,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 95
                    },
                    position: {
                        x: 918.5274658203125,
                        y: -182.967041015625,
                        z: 72.999267578125
                    },
                    height: 0.5,
                    range: 2
                },
                // Never Ending
                {
                    name: 'Infinite',
                    type: 'infinite'
                },
                {
                    name: 'Wait for Taxi request',
                    type: 'target',
                    message: 'Wait for your next customer...'
                },
                {
                    name: 'Retrieve the target.',
                    type: 'targetget',
                    message: 'Retrieve your customer.',
                    range: 5
                },
                {
                    name: 'Drop off the target.',
                    type: 'targetdrop',
                    message: 'Drop off your customer.',
                    range: 5,
                    fare: true
                }
            ]
        },
        {
            name: 'Taxi Station',
            guid: 'taxi', // used for special scripts.
            blipSprite: 56,
            blipColor: 5,
            start: {
                x: 437.3670349121094,
                y: -624.3296508789062,
                z: 27.7069091796875
            },
            required: [{ name: 'Drivers License', inInventory: true }],
            points: [
                {
                    name: 'Retrieve Taxi',
                    type: 'spawnvehicle',
                    reward: 0,
                    blipSprite: 225,
                    blipColor: 1,
                    vehicle: {
                        model: 'taxi',
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
                        x: 408.03955078125,
                        y: -639.6791381835938,
                        z: 27.4879150390625
                    },
                    height: 0.75,
                    range: 2
                },
                {
                    name: 'Exit the Station',
                    type: 'drivepoint',
                    message: '',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 1,
                    markerType: 1,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 95
                    },
                    position: {
                        x: 421.29229736328125,
                        y: -663.7977905273438,
                        z: 27.926025390625
                    },
                    height: 0.5,
                    range: 2
                },
                // Never Ending
                {
                    name: 'Infinite',
                    type: 'infinite'
                },
                {
                    name: 'Wait for Taxi request',
                    type: 'target',
                    message: 'Wait for your next customer...'
                },
                {
                    name: 'Retrieve the target.',
                    type: 'targetget',
                    message: 'Retrieve your customer.',
                    range: 5
                },
                {
                    name: 'Drop off the target.',
                    type: 'targetdrop',
                    message: 'Drop off your customer.',
                    range: 5,
                    fare: true
                }
            ]
        }
    ];
};
