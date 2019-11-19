export const FaceFeatures = {
    Sex: {
        label: 'Sex',
        value: 0,
        min: 0,
        max: 1,
        increment: 1,
        func: updateSex
    },
    FatherFace: {
        label: 'Father Face',
        value: 0,
        min: 0,
        max: 45,
        increment: 1,
        func: updatePlayerFace,
        group: faceGroups['Face']
    },
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
        colorType: 1,
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
        colorType: 1,
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
        colorType: 1,
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
        colorType: 1,
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
        colorType: 1,
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
        colorType: 1,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
        colorType: 2,
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
