/*
 Welcome to the Job / Mission Builder

 This might be my fourth or fifth iteration of this design.
 I feel like this one is the best I've done thus far.
 Here's how it works...
 Below is an example job. This example job... has no purpose.

 It only highlights the various objective types which 
 are provided in the type list below.

 These objective types let YOU create your own jobs very easily.
 The system is built to know what to do next; and lines up
 objectives for the player to complete. It's a very
 simple and easy design.

 You add animations, marker colors, marker types, blips, etc.
 It's meant to handle most instances of 'job' types.

 You can even start a job and wait for an objective to become...
 valid or intercepted through external events.

 A great example of this is the taxi job. Where you can mark the job
 as inifinite; which means it never ends after that type. When you
 do infinite the job continues repeating from the first objective
 after infinite; and goes on forever.

 Objective Types:
    On Foot Point
    { name: 'point', func: pointType },
    Capture Point on Foot
    { name: 'capture', func: captureType },
    Retrieve Item on Foot Type
    { name: 'retreive', func: retrieveType },
    Drop Off Item on Foot Type
    { name: 'dropoff', func: dropOffType },
    Hold 'E' to do something.
    { name: 'hack', func: hackType },
    Drive to a point.
    { name: 'drivepoint', func: drivepointType },
    Spawn a job Vehicle.
    { name: 'spawnvehicle', func: spawnVehicleType },
    Drop off a Vehicle.
    { name: 'vehicledrop', func: vehicleDropType }
*/

export const Configuration = [
    // Test Job
    /*
    {
        name: 'Test Job',
        guid: '',
        blipSprite: 79,
        blipColor: 2,
        start: {
            x: 786.3692626953125,
            y: -278.8483581542969,
            z: 65.78759765625
        },
        points: [
            // Hack some Stuff
            {
                name: 'The Hack Type',
                type: 'hack',
                message: 'Use ~INPUT_CONTEXT~ to hack the concrete.',
                anim: {
                    dict: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
                    name: 'weed_crouch_checkingleaves_idle_01_inspector',
                    duration: -1,
                    flag: 130
                },
                reward: 5000,
                blipSprite: 7,
                blipColor: 1,
                markerType: 5,
                markerColor: {
                    r: 0,
                    g: 0,
                    b: 255,
                    a: 100
                },
                position: {
                    x: 751.068115234375,
                    y: -259.1340637207031,
                    z: 65.4168701171875
                },
                height: 0.5,
                range: 2,
                progressMax: 2
            },
            // Walk to Point
            {
                name: 'The Point Type',
                type: 'point',
                reward: 0,
                blipSprite: 1,
                blipColor: 2,
                markerType: 1,
                markerColor: {
                    r: 0,
                    g: 100,
                    b: 0,
                    a: 50
                },
                position: {
                    x: 767.96044921875,
                    y: -268.5098876953125,
                    z: 65.4000244140625
                },
                height: 0.5,
                range: 3
            },
            // Capture the Point
            {
                name: 'The Capture Point Type',
                type: 'capture',
                message: 'Stand here to capture the point.',
                reward: 2000,
                blipSprite: 89,
                blipColor: 9,
                markerType: 1,
                anim: {
                    dict: 'amb@world_human_hang_out_street@female_arms_crossed@base',
                    name: 'base',
                    duration: -1,
                    flag: 130
                },
                markerColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 95
                },
                position: {
                    x: 763.89892578125,
                    y: -258.27691650390625,
                    z: 65.113525390625
                },
                height: 0.5,
                range: 2,
                progressMax: 5
            },
            // Spawn Vehicle
            {
                name: 'The Spawn Vehicle Type',
                type: 'spawnvehicle',
                message: '',
                vehicle: {
                    model: 'cheetah',
                    lockState: 1, // 1 for unlocked. 2 for locked.
                    preventHijack: true
                },
                reward: 2000,
                blipSprite: 89,
                blipColor: 9,
                markerType: 1,
                markerColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 95
                },
                position: {
                    x: 738.1714477539062,
                    y: -242.3208770751953,
                    z: 66.113525390625
                },
                height: 0.5,
                range: 2
            },
            // Drive to a point.
            {
                name: 'The Drive Point Type',
                type: 'drivepoint',
                message: '',
                vehicle: {
                    model: 'cheetah',
                    lockState: 1, // 1 for unlocked. 2 for locked.
                    preventHijack: true
                },
                reward: 2000,
                blipSprite: 89,
                blipColor: 9,
                markerType: 1,
                markerColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 95
                },
                position: {
                    x: 706.4967041015625,
                    y: -289.70111083984375,
                    z: 59.17138671875
                },
                height: 0.5,
                range: 2
            },
            // Vehicle Drop Off
            {
                name: 'The Vehicle Drop Type',
                type: 'vehicledrop',
                message: '',
                reward: 2000,
                blipSprite: 89,
                blipColor: 9,
                markerType: 0,
                markerColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 95
                },
                position: { x: 722.3736572265625, y: -294.4087829589844, z: 57.94140625 },
                height: 1,
                range: 2
            },
            // Walk Point
            // Vehicle Drop Off
            {
                name: 'The Vehicle Drop Type',
                type: 'point',
                message: '',
                reward: 2000,
                blipSprite: 89,
                blipColor: 9,
                markerType: 0,
                markerColor: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 95
                },
                position: {
                    x: 738.1714477539062,
                    y: -242.3208770751953,
                    z: 66.113525390625
                },
                height: 1,
                range: 2
            }
        ]
    },
    */
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
    },
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
    },
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
                position: { x: -914.1362915039062, y: -2058.2109375, z: 8.2960205078125 },
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
                position: { x: -931.92529296875, y: -2321.56494140625, z: 6.0439453125 },
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
                position: { x: -941.3406372070312, y: -2315.9736328125, z: 6.0439453125 },
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
                position: { x: -876.2901000976562, y: -2254.3515625, z: 5.80810546875 },
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
                position: { x: -901.6615600585938, y: -2208.2373046875, z: 5.1171875 },
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
