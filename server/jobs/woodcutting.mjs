const startingPoint = {
    x: -528.4667358398438,
    y: 5378.85595703125,
    z: 70.30400848388672
};

const cuttingPoints = [
    { x: -553.6077270507812, y: 5444.4072265625, z: 63.15850830078125 },
    { x: -537.6742553710938, y: 5483.0166015625, z: 65.91178131103516 },
    { x: -535.681640625, y: 5491.884765625, z: 65.10186767578125 },
    { x: -540.5409545898438, y: 5491.822265625, z: 63.645713806152344 },
    { x: -565.7108764648438, y: 5502.05322265625, z: 57.98692321777344 },
    { x: -581.5857543945312, y: 5491.42822265625, z: 56.020076751708984 },
    { x: -580.0662841796875, y: 5472.3837890625, z: 59.48595428466797 },
    { x: -561.1137084960938, y: 5461.65771484375, z: 63.2216796875 }
];

let cutTemplate = {
    name: 'Axe',
    type: 'hack',
    message: 'Use ~INPUT_CONTEXT~ to cut wood.',
    reward: 0,
    blipSprite: 653,
    blipColor: 1,
    markerType: 1,
    markerColor: {
        r: 255,
        g: 0,
        b: 0,
        a: 150
    },
    anim: {
        dict: 'melee@large_wpn@streamed_core',
        name: 'long_0_attack',
        duration: -1,
        flag: 129,
        freezeX: true,
        freezeY: true,
        freezeZ: true
    },
    sound: 'chop',
    height: 2,
    range: 2,
    progressMax: 10
};

const jobBuild = {
    name: 'Woodcutting',
    blipSprite: 570,
    blipColor: 2,
    required: [{ name: 'Axe', inInventory: true }],
    start: startingPoint,
    points: [
        {
            name: 'Axe',
            type: 'hack',
            message: 'Use ~INPUT_CONTEXT~ to cut wood.',
            reward: 0,
            blipSprite: 653,
            blipColor: 1,
            markerType: 1,
            markerColor: {
                r: 255,
                g: 0,
                b: 0,
                a: 150
            },
            anim: {
                dict: 'melee@large_wpn@streamed_core',
                name: 'long_0_attack',
                duration: -1,
                flag: 129,
                freezeX: true,
                freezeY: true,
                freezeZ: true
            },
            sound: 'chop',
            height: 2,
            range: 2,
            position: {
                x: -557.5377807617188,
                y: 5420.017578125,
                z: 62.17388153076172
            },
            progressMax: 10
        },
        {
            name: 'Infinite',
            type: 'infinite'
        }
    ]
};

cuttingPoints.forEach((cutPoint, index) => {
    let template = { ...cutTemplate };
    template.position = cutPoint;
    template.position.z -= 1;
    jobBuild.points.push(template);

    if (cuttingPoints.length - 1 !== index) {
        jobBuild.points.push({
            name: 'Get Item',
            type: 'rewarditem',
            item: 'Unrefined Wood',
            quantity: 2
        });
        jobBuild.points.push({
            name: 'Reward XP',
            type: 'rewardxp',
            skill: 'woodcutting',
            quantity: 32
        });
    }
});

export const job = () => {
    return [jobBuild];
};
