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
 as inifinite; which means it never ends.

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
    {
        name: 'Test Job',
        blipSprite: 79,
        blipColor: 2,
        start: {
            x: 786.3692626953125,
            y: -278.8483581542969,
            z: 65.78759765625
        },
        points: [
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
                range: 5
            },
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
    }
    // Next Job Goes Here
];
