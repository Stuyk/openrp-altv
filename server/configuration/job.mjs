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
            {
                name: 'First Point',
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
                range: 5
            },
            {
                name: 'Second Point Thing',
                type: 'hack',
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
                range: 2,
                progressMax: 20
            }
        ]
    }
    // Next Job Goes Here
];
