export const job = () => {
    return [
        {
            name: 'DMV',
            guid: '', // used for special scripts.
            blipSprite: 498,
            blipColor: 3,
            start: {
                x: -914.5186767578125,
                y: -2038.865966796875,
                z: 8.3970947265625
            },
            // List of required or no-items in inventory.
            required: [{ name: 'Drivers License', inInventory: false }],
            points: [
                {
                    name: 'Retrieve your vehicle.',
                    type: 'spawnvehicle',
                    message: 'Retrieve your test vehicle.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    vehicle: {
                        model: 'dilettante',
                        lockState: 1, // 1 for unlocked. 2 for locked.
                        preventHijack: true
                    },
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -914.1362915039062,
                        y: -2058.2109375,
                        z: 8.2960205078125
                    },
                    height: 0.75,
                    range: 2
                },
                {
                    name: 'Drive carefully to the exit.',
                    type: 'drivepoint',
                    message: 'Drive carefully to the exit.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -953.6571655273438,
                        y: -2112.619873046875,
                        z: 8.2960205078125
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Stop at the stop sign.',
                    type: 'drivecapture',
                    message: 'Stop at the stop sign. Then make a left.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -951.7186889648438,
                        y: -2140.602294921875,
                        z: 8.3018798828125
                    },
                    height: 0.5,
                    range: 2,
                    progressMax: 3
                },
                {
                    name: 'Proceed with the left hand turn.',
                    type: 'drivepoint',
                    message: 'Proceed with the left hand turn.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -879.1780395507812,
                        y: -2236.20654296875,
                        z: 5.2689208984375
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Drive to the point; but slow down just before.',
                    type: 'drivepoint',
                    message: 'Drive to the point; but slow down just before.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -879.1780395507812,
                        y: -2236.20654296875,
                        z: 5.2689208984375
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Enter the parking lot.',
                    type: 'drivepoint',
                    message: 'Enter the parking lot and go to the end.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -881.3406372070312,
                        y: -2253.75830078125,
                        z: 5.9091796875
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Stop up ahead.',
                    type: 'drivecapture',
                    message: 'Stop up ahead.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -932.4263916015625,
                        y: -2312.901123046875,
                        z: 6.0439453125
                    },
                    height: 0.5,
                    range: 2,
                    progressMax: 2
                },
                {
                    name: 'Pull into the left parking space.',
                    type: 'drivecapture',
                    message: 'Pull into the left parking space.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -931.92529296875,
                        y: -2321.56494140625,
                        z: 6.0439453125
                    },
                    height: 0.5,
                    range: 2,
                    progressMax: 5
                },
                {
                    name: 'Back up into the space behind you.',
                    type: 'drivecapture',
                    message: 'Back up into the space behind you.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -941.3406372070312,
                        y: -2315.9736328125,
                        z: 6.0439453125
                    },
                    height: 0.5,
                    range: 2,
                    progressMax: 5
                },
                {
                    name: 'Yield for oncoming traffic.',
                    type: 'drivecapture',
                    message: 'Yield for oncoming traffic.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -876.2901000976562,
                        y: -2254.3515625,
                        z: 5.80810546875
                    },
                    height: 0.5,
                    range: 2,
                    progressMax: 2
                },
                {
                    name: 'Make a left and follow the road.',
                    type: 'drivepoint',
                    message: 'Make a left and follow the road.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -901.6615600585938,
                        y: -2208.2373046875,
                        z: 5.1171875
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Make a right; here.',
                    type: 'drivepoint',
                    message: 'Make a right; here.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -949.5823974609375,
                        y: -2159.59130859375,
                        z: 8.251220703125
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Drop off your vehicle here.',
                    type: 'vehicledrop',
                    message: 'Drop off your vehicle here.',
                    reward: 0,
                    blipSprite: 1,
                    blipColor: 3,
                    markerType: 1,
                    markerColor: {
                        r: 0,
                        g: 190,
                        b: 250,
                        a: 150
                    },
                    position: {
                        x: -898.04833984375,
                        y: -2035.5692138671875,
                        z: 8.6387939453125
                    },
                    height: 0.5,
                    range: 2
                },
                {
                    name: 'Get Item',
                    type: 'rewarditem',
                    item: 'Drivers License',
                    quantity: 1
                }
            ]
        }
    ];
};
