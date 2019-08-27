/* eslint-disable no-undef */
const faceGroups = {
    Freckles: ['Freckles', 'FrecklesOpacity'],
    Lipstick: ['Lipstick', 'LipstickOpacity', 'LipstickColor', 'LipstickColor2'],
    SunDamage: ['SunDamage', 'SunDamageOpacity'],
    Complexion: ['Complexion', 'ComplexionOpacity'],
    Blush: ['Blush', 'BlushOpacity', 'BlushColor'],
    Makeup: ['Makeup', 'MakeupOpacity', 'MakeupColor', 'MakeupColor2'],
    Age: ['Age', 'AgeOpacity'],
    Eyebrows: ['Eyebrows', 'EyebrowsOpacity', 'EyebrowsColor', 'EyebrowsColor2'],
    FacialHair: [
        'FacialHair',
        'FacialHairOpacity',
        'FacialHairColor',
        'FacialHairColor2'
    ],
    Blemishes: ['Blemish', 'BlemishOpacity'],
    Hair: ['Hair', 'HairColor', 'HairHighlights', 'HairTexture'],
    Face: ['FatherFace', 'MotherFace', 'FatherSkin', 'MotherSkin', 'FaceMix', 'SkinMix']
};

const hairOverlaysMale = {
    0: { collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz' },
    1: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_001' },
    2: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002' },
    3: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_003' },
    4: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_004' },
    5: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_005' },
    6: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_006' },
    7: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_007' },
    8: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_008' },
    9: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_009' },
    10: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_013' },
    11: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002' },
    12: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_011' },
    13: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_012' },
    14: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014' },
    15: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015' },
    16: { collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_000' },
    17: { collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_001' },
    18: { collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_000' },
    19: { collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_001' },
    20: { collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_000' },
    21: { collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_001' },
    22: { collection: 'multiplayer_overlays', overlay: 'NGInd_M_Hair_000' },
    24: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_000' },
    25: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_001' },
    26: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_002' },
    27: { collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_003' },
    28: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_004' },
    29: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_005' },
    30: { collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_006' },
    31: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_M' },
    32: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_M' },
    33: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M' },
    34: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_M' },
    35: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_M' },
    36: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_005_M' },
    72: {
        collection: 'mpgunrunning_overlays',
        overlay: 'MP_Gunrunning_Hair_M_000_M'
    },
    73: {
        collection: 'mpgunrunning_overlays',
        overlay: 'MP_Gunrunning_Hair_M_001_M'
    }
};

const hairOverlaysFemale = {
    0: { collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz' },
    1: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_001' },
    2: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_002' },
    3: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003' },
    4: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_004' },
    5: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_005' },
    6: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_006' },
    7: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007' },
    8: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_008' },
    9: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_009' },
    10: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_010' },
    11: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_011' },
    12: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_012' },
    13: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_013' },
    14: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014' },
    15: { collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015' },
    16: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_000' },
    17: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001' },
    18: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007' },
    19: { collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_000' },
    20: { collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_001' },
    21: { collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001' },
    22: { collection: 'multiplayer_overlays', overlay: 'NGHip_F_Hair_000' },
    23: { collection: 'multiplayer_overlays', overlay: 'NGInd_F_Hair_000' },
    25: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_000' },
    26: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_001' },
    27: { collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_002' },
    28: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003' },
    29: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003' },
    30: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_004' },
    31: { collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_006' },
    32: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_F' },
    33: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_F' },
    34: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_F' },
    35: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_F' },
    36: { collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003' },
    37: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_006_F' },
    38: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_F' },
    76: {
        collection: 'mpgunrunning_overlays',
        overlay: 'MP_Gunrunning_Hair_F_000_F'
    },
    77: {
        collection: 'mpgunrunning_overlays',
        overlay: 'MP_Gunrunning_Hair_F_001_F'
    }
};

const facialFeatures = {
    Sex: {
        label: 'Sex',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        func: updateSex
    }, // 0
    FatherFace: {
        label: 'Father Face',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    }, // 1
    FatherSkin: {
        label: 'Father Skin',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    }, // 2
    MotherFace: {
        label: 'Mother Face',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    }, // 3
    MotherSkin: {
        label: 'Mother Skin',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    },
    FaceMix: {
        label: 'Face Mix',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    }, // 7
    SkinMix: {
        label: 'Skin Mix',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    },
    Hair: {
        label: 'Hair',
        value: 0,
        min: 0,
        max: 78,
        increment: 1,
        id: 2,
        func: updateHair,
        group: faceGroups['Hair'],
        femaleBlacklist: [24],
        maleBlacklist: [23]
    }, // 10
    HairColor: {
        label: 'Hair Color',
        value: 0,
        min: 0,
        max: 78,
        id: 2,
        increment: 1,
        func: updateHair,
        group: faceGroups['Hair']
    }, // 11
    HairHighlights: {
        label: 'Hair Highlights',
        value: 0,
        min: 0,
        max: 78,
        id: 2,
        increment: 1,
        func: updateHair,
        group: faceGroups['Hair']
    }, // 12
    HairTexture: {
        label: 'Hair Texture',
        value: 0,
        min: 0,
        max: 0,
        id: 2,
        increment: 1,
        func: updateHair,
        group: faceGroups['Hair']
    }, // 13
    EyesColor: {
        label: 'Eyes Color',
        value: 0,
        min: 0,
        max: 32,
        id: 7,
        func: updateEyes,
        increment: 1
    }, // 14
    NoseWidth: {
        label: 'Nose Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 0,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 15
    NoseHeight: {
        label: 'Nose Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 1,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 16
    NoseLength: {
        label: 'Nose Length',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 2,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 17
    NoseBridge: {
        label: 'Nose Bridge',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 3,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 18
    NoseTip: {
        label: 'Nose Tip',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 4,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 19
    NoseBridgeShaft: {
        label: 'Nose Bridge Shaft',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 5,
        func: updateFaceFeature,
        isFaceFeature: true
    }, //20
    BrowHeight: {
        label: 'Brow Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 6,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 21
    BrowWidth: {
        label: 'Brow Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 7,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 22
    CheekboneHeight: {
        label: 'Cheekbone Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 8,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 23
    CheekboneWidth: {
        label: 'Cheekbone Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 9,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 24
    CheekWidth: {
        label: 'Cheek Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 10,

        func: updateFaceFeature,
        isFaceFeature: true
    }, // 25
    Eyelids: {
        label: 'Eyelids',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 11,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 26
    Lips: {
        label: 'Lips',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 12,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 27
    JawWidth: {
        label: 'Jaw Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 13,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 28
    JawHeight: {
        label: 'Jaw Height',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 14,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 29
    ChinLength: {
        label: 'Chin Length',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 15,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 30
    ChinPosition: {
        label: 'Chin Position',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 16,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 31
    ChinWidth: {
        label: 'Chin Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 17,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 32
    ChinShape: {
        label: 'Chin Shape',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 18,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 33
    NeckWidth: {
        label: 'Neck Width',
        value: 0,
        min: -1,
        max: 1,
        increment: 0.1,
        id: 19,
        func: updateFaceFeature,
        isFaceFeature: true
    }, // 34
    Blemish: {
        label: 'Blemish',
        value: 0,
        min: 0,
        max: 23,
        increment: 1,
        id: 0,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Blemishes']
    }, // 35
    BlemishOpacity: {
        label: 'Blemish Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 0,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Blemishes']
    },
    FacialHair: {
        label: 'Facial Hair',
        value: 0,
        min: 0,
        max: 28,
        increment: 1,
        id: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['FacialHair']
    }, // 37, 2
    FacialHairOpacity: {
        label: 'Facial Hair Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['FacialHair']
    },
    FacialHairColor: {
        label: 'Facial Hair Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 1,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['FacialHair']
    },
    FacialHairColor2: {
        label: 'Facial Hair Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['FacialHair']
    },
    Eyebrows: {
        label: 'Eyebrows',
        value: 0,
        min: 0,
        max: 33,
        increment: 1,
        id: 2,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Eyebrows']
    }, // 41
    EyebrowsOpacity: {
        label: 'Eyebrows Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 2,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Eyebrows']
    },
    EyebrowsColor: {
        label: 'Eyebrows Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 2,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Eyebrows']
    },
    EyebrowsColor2: {
        label: 'Eyebrows Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 2,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Eyebrows']
    },
    Age: {
        label: 'Age',
        value: 0,
        min: 0,
        max: 14,
        increment: 1,
        id: 3,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Age']
    }, // 45
    AgeOpacity: {
        label: 'Age Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 3,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Age']
    },
    Makeup: {
        label: 'Makeup',
        value: 0,
        min: 0,
        max: 74,
        increment: 1,
        id: 4,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Makeup']
    }, // 47
    MakeupOpacity: {
        label: 'Makeup Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 4,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Makeup']
    },
    MakeupColor: {
        label: 'Makeup Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 4,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Makeup']
    },
    MakeupColor2: {
        label: 'Makeup Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 4,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Makeup']
    },
    Blush: {
        label: 'Blush',
        value: 0,
        min: 0,
        max: 6,
        increment: 1,
        id: 5,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Blush']
    }, // 51
    BlushOpacity: {
        label: 'Blush Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 5,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Blush']
    },
    BlushColor: {
        label: 'Blush Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 5,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Blush']
    },
    Complexion: {
        label: 'Complexion',
        value: 0,
        min: 0,
        max: 11,
        increment: 1,
        id: 6,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Complexion']
    }, // 54
    ComplexionOpacity: {
        label: 'Complexion Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 6,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Complexion']
    },
    SunDamage: {
        label: 'Sun Damage',
        value: 0,
        min: 0,
        max: 10,
        increment: 1,
        id: 7,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['SunDamage']
    }, // 56
    SunDamageOpacity: {
        label: 'Sun Damage Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 7,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['SunDamage']
    },
    Lipstick: {
        label: 'Lipstick',
        value: 0,
        min: 0,
        max: 9,
        increment: 1,
        id: 8,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Lipstick']
    }, // 58, 22
    LipstickOpacity: {
        label: 'Lipstick Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 8,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Lipstick']
    },
    LipstickColor: {
        label: 'Lipstick Color',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 8,
        colorType: 1,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Lipstick']
    },
    LipstickColor2: {
        label: 'Lipstick Color 2',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        id: 8,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Lipstick']
    },
    Freckles: {
        label: 'Freckles',
        value: 0,
        min: 0,
        max: 17,
        increment: 1,
        id: 9,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Freckles']
    }, // 62, 26
    FrecklesOpacity: {
        label: 'Freckles Opacity',
        value: 0,
        min: 0,
        max: 1,
        increment: 0.1,
        id: 9,
        func: updateFaceDecor,
        isFacialDecor: true,
        group: faceGroups['Freckles']
    }
};

// Create Element, Render, Component, etc.
const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'loading...',
            hairChanged: false,
            faceData: []
        };
    }

    componentDidMount() {
        this.setState({
            faceData: [...this.state.faceData, ...Object.values(facialFeatures)]
        });

        if ('alt' in window) {
            // Grab the Style Variations
            alt.on('stylesUpdate', this.handleStyleUpdates.bind(this));
            alt.on('setHairTextureVariations', this.setHairTextureVariations.bind(this));
            alt.on('sexUpdated', this.sexUpdated.bind(this));
        }

        this.setState({ message: 'Done! ' });
    }

    sexUpdated(id) {
        let faceData = [...this.state.faceData];

        let faceValue = id === 0 ? 45 : 0;

        let motherFaceIndex = faceData.findIndex(x => x.label === 'Mother Face');
        faceData[motherFaceIndex].value = faceValue;

        let fatherFaceIndex = faceData.findIndex(x => x.label === 'Father Face');
        faceData[fatherFaceIndex].value = faceValue;
        faceData[fatherFaceIndex].func(faceData, fatherFaceIndex);

        let hairIndex = faceData.findIndex(x => x.label === 'Hair');
        faceData[hairIndex].func(faceData, hairIndex);

        this.setState({ faceData });
    }

    handleStyleUpdates(styles, colors) {
        let faceData = [...this.state.faceData];

        faceData.forEach(item => {
            if (!item.label.includes('Color')) return;
            item.max = colors - 1;
        });

        // Update Hair Max Values if Necessary
        let hairIndex = faceData.findIndex(x => x.label === 'Hair');
        faceData[hairIndex].max = styles - 1;
        this.setState({ faceData });
    }

    setHairTextureVariations(textures) {
        let faceData = [...this.state.faceData];

        if (this.state.hairChanged) {
            let textureIndex = faceData.findIndex(x => x.label === 'Hair Texture');
            faceData[textureIndex].max = textures - 1;
            faceData[textureIndex].value = 0;
        }

        this.setState({ faceData, hairChanged: false });
    }

    setItemValue(index, increment) {
        // Make a copy of the state.
        let faceData = [...this.state.faceData];

        // Modify the state.
        if (increment) {
            // Increase Face Data Increment
            faceData[index].value += faceData[index].increment;

            if (faceData[index].value > faceData[index].max) {
                faceData[index].value = faceData[index].min;
            }
        } else {
            // Subtract Face Data Increment
            faceData[index].value -= faceData[index].increment;

            if (faceData[index].value < faceData[index].min) {
                faceData[index].value = faceData[index].max;
            }
        }

        // Hair Updates
        let hairChanged = false;
        if (faceData[index].label === 'Hair') {
            hairChanged = true;
            let sex = faceData.find(x => x.label === 'Sex');

            if (sex.value === 0) {
                // If the value is blacklisted.
                if (faceData[index].femaleBlacklist.includes(faceData[index].value)) {
                    if (increment) {
                        faceData[index].value += 1;
                    } else {
                        faceData[index].value -= 1;
                    }
                }
            } else {
                // If the value is blacklisted.
                if (faceData[index].maleBlacklist.includes(faceData[index].value)) {
                    if (increment) {
                        faceData[index].value += 1;
                    } else {
                        faceData[index].value -= 1;
                    }
                }
            }
        }

        // Normalize decimals for the value.
        faceData[index].value = faceData[index].value.toFixed(2) * 1;

        // Execute the paired function.
        faceData[index].func(faceData, index);

        // Set the faceData to itself.
        this.setState({ faceData, hairChanged });
    }

    submitChanges() {
        let faceData = [...this.state.faceData];
        const dataPairs = {};

        faceData.forEach(item => {
            let key = item.label.split(' ').join('');

            dataPairs[key] = {};
            dataPairs[key].value = item.value;

            if (item.id !== undefined) {
                dataPairs[key].id = item.id;
            }
        });

        let hairOverlay =
            dataPairs['Sex'].value === 0
                ? hairOverlaysFemale[dataPairs['Hair'].value]
                : hairOverlaysMale[dataPairs['Hair'].value];

        if (hairOverlay) {
            dataPairs['Overlay'] = hairOverlay;
        }

        let items = JSON.stringify(dataPairs);
        alt.emit('setPlayerFacialData', items);
    }

    // render to the HTML template.
    render() {
        return h(
            'div',
            { id: 'app' },
            h(
                'div',
                { class: 'tab' },
                h('h1', { class: 'title' }, 'Player Customization')
            ),
            h(
                'div',
                { class: 'mod-list scroll' },
                h(FaceList, {
                    faceData: this.state.faceData,
                    setItemValue: this.setItemValue.bind(this)
                })
            ),
            h(SubmitButton, {
                class: 'footer',
                submitChanges: this.submitChanges.bind(this)
            })
        );
        // Render HTML / Components and Shit Here
    }
}

// Render the APP Class from the RENDER function inside of it.
const FaceList = ({ faceData, setItemValue }) => {
    const itemList = faceData.map((item, index) =>
        h(FaceItem, { index, item, setItemValue })
    );

    return h('div', null, itemList);
};

// Items to Display in a Group
const FaceItem = ({ index, item, setItemValue }) => {
    left = () => {
        setItemValue(index, false);
    };
    right = () => {
        setItemValue(index, true);
    };
    return h(
        'div',
        { class: 'mod' },
        h('div', { class: 'title' }, `${item.label}`),
        h('div', { class: 'count' }, `${item.value}/${item.max}`),
        h(
            'div',
            { class: 'item-switcher' },

            h(
                'button',
                {
                    class: 'left button',
                    onclick: this.left.bind(this)
                },
                '<'
            ),
            h(
                'button',
                {
                    class: 'right button',
                    onclick: this.right.bind(this)
                },
                '>'
            )
        )
    );
};

const SubmitButton = ({ submitChanges }) => {
    return h('div', { class: 'footer', onclick: submitChanges.bind(this) }, 'Submit');
};

// Render the above component
render(h(App), document.querySelector('#render'));

function updateSex(faceData, index) {
    // Update the Sex of a Player
    alt.emit('updateSex', faceData[index].value);
}

function updatePlayerFace(faceData, index) {
    let items = getByGroup(faceData, faceData[index].group);
    alt.emit('updatePlayerFace', JSON.stringify(items));
}

function updateHair(faceData, index) {
    let items = getByGroup(faceData, faceData[index].group);
    let overlayData =
        faceData[0].value === 0
            ? hairOverlaysFemale[items[0]]
            : hairOverlaysMale[items[0]];

    alt.emit('updateHair', JSON.stringify(items), overlayData);
}

function updateEyes(faceData, index) {
    alt.emit('updateEyes', faceData[index].value);
}

// Updates Fine Details of the Face.
function updateFaceFeature(faceData, index) {
    alt.emit('updateFaceFeature', faceData[index].id, faceData[index].value);
}

function updateFaceDecor(faceData, index) {
    let items = getByGroup(faceData, faceData[index].group);
    alt.emit(
        'updateFaceDecor',
        faceData[index].id,
        faceData[index].colorType,
        JSON.stringify(items)
    );
}

function getByGroup(faceData, groupName) {
    const items = [];

    for (let i = 0; i < faceData.length; i++) {
        if (faceData[i].group !== groupName) continue;
        items.push(faceData[i].value);
    }

    return items;
}
