export const job = () => {
    return [
        {
            name: 'Mining',
            blipSprite: 653,
            blipColor: 2,
            required: [{ name: 'Pickaxe', inInventory: true }],
            start: {
                x: 2945.88427734375,
                y: 2746.795654296875,
                z: 42.401432037353516
            },
            points: [
                {
                    name: 'Begin Mining',
                    type: 'hack',
                    message: 'Use ~INPUT_CONTEXT~ to mine.',
                    reward: 0,
                    blipSprite: 653,
                    blipColor: 1,
                    markerType: 0,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 3004.31787109375,
                        y: 2763.23876953125,
                        z: 42.703311920166016
                    },
                    anim: {
                        dict: 'melee@large_wpn@streamed_core',
                        name: 'ground_attack_on_spot',
                        duration: -1,
                        flag: 129,
                        freezeX: true,
                        freezeY: true,
                        freezeZ: true
                    },
                    height: 2,
                    range: 10,
                    progressMax: 10
                },
                {
                    name: 'Infinite',
                    type: 'infinite'
                },
                {
                    name: 'Mine in the quarry.',
                    type: 'hack',
                    message: 'Use ~INPUT_CONTEXT~ to mine.',
                    reward: 0,
                    blipSprite: 653,
                    blipColor: 1,
                    markerType: 0,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 2980.8740234375,
                        y: 2824.298095703125,
                        z: 44.868675231933594
                    },
                    anim: {
                        dict: 'melee@large_wpn@streamed_core',
                        name: 'ground_attack_on_spot',
                        duration: -1,
                        flag: 129,
                        freezeX: true,
                        freezeY: true,
                        freezeZ: true
                    },
                    height: 2,
                    range: 10,
                    progressMax: 10
                },
                {
                    name: 'Reward XP',
                    type: 'rewardxp',
                    skill: 'mining',
                    quantity: 10
                },
                {
                    name: 'Mine in the quarry.',
                    type: 'hack',
                    message: 'Use ~INPUT_CONTEXT~ to mine.',
                    reward: 0,
                    blipSprite: 653,
                    blipColor: 1,
                    markerType: 0,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 2945.402099609375,
                        y: 2850.28466796875,
                        z: 47.67905044555664
                    },
                    anim: {
                        dict: 'melee@large_wpn@streamed_core',
                        name: 'ground_attack_on_spot',
                        duration: -1,
                        flag: 129,
                        freezeX: true,
                        freezeY: true,
                        freezeZ: true
                    },
                    height: 2,
                    range: 10,
                    progressMax: 10
                },
                {
                    name: 'Reward XP',
                    type: 'rewardxp',
                    skill: 'mining',
                    quantity: 10
                },
                {
                    name: 'Mine in the quarry.',
                    type: 'hack',
                    message: 'Use ~INPUT_CONTEXT~ to mine.',
                    reward: 0,
                    blipSprite: 653,
                    blipColor: 1,
                    markerType: 0,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 2928.97705078125,
                        y: 2859.59423828125,
                        z: 55.46247863769531
                    },
                    anim: {
                        dict: 'melee@large_wpn@streamed_core',
                        name: 'ground_attack_on_spot',
                        duration: -1,
                        flag: 129,
                        freezeX: true,
                        freezeY: true,
                        freezeZ: true
                    },
                    height: 2,
                    range: 10,
                    progressMax: 10
                },
                {
                    name: 'Get Item',
                    type: 'rewarditem',
                    item: 'Unrefined Rock',
                    quantity: 5
                },
                {
                    name: 'Reward XP',
                    type: 'rewardxp',
                    skill: 'mining',
                    quantity: 10
                },
                {
                    name: 'Mine in the quarry.',
                    type: 'hack',
                    message: 'Use ~INPUT_CONTEXT~ to mine.',
                    reward: 0,
                    blipSprite: 653,
                    blipColor: 1,
                    markerType: 0,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 2978.1220703125,
                        y: 2873.204345703125,
                        z: 59.04841995239258
                    },
                    anim: {
                        dict: 'melee@large_wpn@streamed_core',
                        name: 'ground_attack_on_spot',
                        duration: -1,
                        flag: 129,
                        freezeX: true,
                        freezeY: true,
                        freezeZ: true
                    },
                    height: 2,
                    range: 10,
                    progressMax: 10
                },
                {
                    name: 'Reward XP',
                    type: 'rewardxp',
                    skill: 'mining',
                    quantity: 120
                },
                {
                    name: 'Mine in the quarry.',
                    type: 'hack',
                    message: 'Use ~INPUT_CONTEXT~ to mine.',
                    reward: 0,
                    blipSprite: 653,
                    blipColor: 1,
                    markerType: 0,
                    markerColor: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 150
                    },
                    position: {
                        x: 2954.307861328125,
                        y: 2825.844482421875,
                        z: 43.781219482421875
                    },
                    anim: {
                        dict: 'melee@large_wpn@streamed_core',
                        name: 'ground_attack_on_spot',
                        duration: -1,
                        flag: 129,
                        freezeX: true,
                        freezeY: true,
                        freezeZ: true
                    },
                    height: 2,
                    range: 10,
                    progressMax: 10
                }
            ]
        }
    ];
};
