export const FaceProperties = {
    SexGroup: [
        {
            label: 'Sex',
            key: 'sex',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        }
    ],
    FaceGroup: [
        {
            label: 'Father Face',
            key: 'fatherface',
            value: 33,
            min: 0,
            max: 45,
            increment: 1,
            useFaceNames: true
        },
        {
            label: 'Mother Face',
            key: 'motherface',
            value: 45,
            min: 0,
            max: 45,
            increment: 1,
            group: 0,
            useFaceNames: true
        },
        {
            label: 'Father Skin',
            key: 'fatherskin',
            value: 45,
            min: 0,
            max: 45,
            increment: 1,
            useFaceNames: true
        },
        {
            label: 'Mother Skin',
            key: 'motherskin',
            value: 35,
            min: 0,
            max: 45,
            increment: 1,
            useFaceNames: true
        },
        {
            label: 'Face Mix',
            key: 'facemix',
            value: 0.5,
            min: 0,
            max: 1,
            increment: 0.1
        },
        {
            label: 'Skin Mix',
            key: 'skinmix',
            value: 0.5,
            min: 0,
            max: 1,
            increment: 0.1
        }
    ],
    StructureGroup: [
        {
            label: 'Nose Width',
            key: 'nosewidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 0
        },
        {
            label: 'Nose Height',
            key: 'noseheight',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 1
        },
        {
            label: 'Nose Length',
            key: 'noselength',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 2
        },
        {
            label: 'Nose Bridge',
            key: 'nosebridge',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 3
        },
        {
            label: 'Nose Tip',
            key: 'nosetip',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 4
        },
        {
            label: 'Nose Bridge Shaft',
            key: 'nosebridgeshaft',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 5
        },
        {
            label: 'Brow Height',
            key: 'browheight',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 6
        },
        {
            label: 'Brow Width',
            key: 'browwidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 7
        },
        {
            label: 'Cheekbone Height',
            key: 'cheekboneheight',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 8
        },
        {
            label: 'Cheekbone Width',
            key: 'cheekbonewidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 9
        },
        {
            label: 'Cheek Width',
            key: 'cheekwidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 10
        },
        {
            label: 'Eyelids',
            key: 'eyelids',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 11
        },
        {
            label: 'Lips',
            key: 'lips',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 12
        },
        {
            label: 'Jaw Width',
            key: 'jawwidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 13
        },
        {
            label: 'Jaw Height',
            key: 'jawheight',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 14
        },
        {
            label: 'Chin Length',
            key: 'chinlength',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 15
        },
        {
            label: 'Chin Position',
            key: 'chinposition',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 16
        },
        {
            label: 'Chin Width',
            key: 'chinwidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 17
        },
        {
            label: 'Chin Shape',
            key: 'chinshape',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 18
        },
        {
            label: 'Neck Width',
            key: 'neckwidth',
            value: 0,
            min: -2,
            max: 2,
            increment: 0.1,
            id: 19
        }
    ],
    HairGroup: [
        {
            // 37 is Minimum / MP Useable
            label: 'Hair',
            key: 'hair',
            value: 0,
            min: 0,
            max: 75,
            increment: 1,
            id: 2
        },
        {
            label: 'Hair Color',
            key: 'haircolor',
            value: 0,
            min: 0,
            max: 78,
            id: 2,
            increment: 1
        },
        {
            label: 'Hair Highlights',
            key: 'hairhighlights',
            value: 0,
            min: 0,
            max: 78,
            id: 2,
            increment: 1
        },
        {
            label: 'Hair Texture',
            key: 'hairtexture',
            value: 0,
            min: 0,
            max: 0,
            id: 2,
            increment: 1
        },
        {
            label: 'Facial Hair',
            key: 'facialhair',
            value: 0,
            min: 0,
            max: 28,
            increment: 1,
            id: 1,
            colorType: 1
        },
        {
            label: 'Facial Hair Opacity',
            key: 'facialhairopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 1,
            colorType: 1
        },
        {
            label: 'Facial Hair Color',
            key: 'facialhaircolor',
            value: 0,
            min: 0,
            max: 78,
            increment: 1,
            id: 1,
            colorType: 1
        },
        {
            label: 'Facial Hair Color 2',
            key: 'facialhaircolor2',
            value: 0,
            min: 0,
            max: 78,
            increment: 1,
            id: 1,
            colorType: 1
        }
    ],
    EyesGroup: [
        {
            label: 'Eyes Color',
            key: 'eyescolor',
            value: 0,
            min: 0,
            max: 31,
            id: 7,
            increment: 1
        },
        {
            label: 'Eyebrows',
            key: 'eyebrows',
            value: 0,
            min: 0,
            max: 33,
            increment: 1,
            id: 2,
            colorType: 1
        },
        {
            label: 'Eyebrows Opacity',
            key: 'eyebrowsopacity',
            value: 1,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 2,
            colorType: 1
        },
        {
            label: 'Eyebrows Color',
            key: 'eyebrowscolor',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 2,
            colorType: 1
        },
        {
            label: 'Eyebrows Color 2',
            key: 'eyebrowscolor2',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 2,
            colorType: 1
        }
    ],
    DetailGroup: [
        {
            label: 'Blemish',
            key: 'blemish',
            value: 0,
            min: 0,
            max: 23,
            increment: 1,
            id: 0
        },
        {
            label: 'Blemish Opacity',
            key: 'blemishopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 0
        },
        {
            label: 'Age',
            key: 'age',
            value: 0,
            min: 0,
            max: 14,
            increment: 1,
            id: 3
        },
        {
            label: 'Age Opacity',
            key: 'ageopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 3
        },
        {
            label: 'Complexion',
            key: 'complexion',
            value: 0,
            min: 0,
            max: 11,
            increment: 1,
            id: 6
        },
        {
            label: 'Complexion Opacity',
            key: 'complexionopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 6
        },
        {
            label: 'Sun Damage',
            key: 'sundamage',
            value: 0,
            min: 0,
            max: 10,
            increment: 1,
            id: 7
        }, // 56
        {
            label: 'Sun Damage Opacity',
            key: 'sundamageopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 7
        },
        {
            label: 'Freckles',
            key: 'freckles',
            value: 0,
            min: 0,
            max: 17,
            increment: 1,
            id: 9
        }, // 62, 26
        {
            label: 'Freckles Opacity',
            key: 'frecklesopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 9
        },
        {
            label: 'Body Blemish',
            key: 'bodyblemish',
            value: 0,
            min: 0,
            max: 11,
            increment: 1,
            id: 11
        },
        {
            label: 'Body Blemish Opacity',
            key: 'bodyblemishopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 11
        }
    ],
    MakeupGroup: [
        {
            label: 'Makeup',
            key: 'makeup',
            value: 0,
            min: 0,
            max: 74,
            increment: 1,
            id: 4,
            colorType: 2
        },
        {
            label: 'Makeup Opacity',
            key: 'makeupopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 4,
            colorType: 2
        },
        {
            label: 'Makeup Color',
            key: 'makeupcolor',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 4,
            colorType: 2
        },
        {
            label: 'Makeup Color 2',
            key: 'makeupcolor2',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 4,
            colorType: 2
        },
        {
            label: 'Blush',
            key: 'blush',
            value: 0,
            min: 0,
            max: 6,
            increment: 1,
            id: 5,
            colorType: 2
        },
        {
            label: 'Blush Opacity',
            key: 'blushopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 5,
            colorType: 2
        },
        {
            label: 'Blush Color',
            key: 'blushcolor',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 5,
            colorType: 2
        },
        {
            label: 'Lipstick',
            key: 'lipstick',
            value: 0,
            min: 0,
            max: 9,
            increment: 1,
            id: 8,
            colorType: 2
        },
        {
            label: 'Lipstick Opacity',
            key: 'lipstickopacity',
            value: 0,
            min: 0,
            max: 1,
            increment: 0.1,
            id: 8,
            colorType: 2
        },
        {
            label: 'Lipstick Color',
            key: 'lipstickcolor',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 8,
            colorType: 2
        },
        {
            label: 'Lipstick Color 2',
            key: 'lipstickcolor2',
            value: 0,
            min: 0,
            max: 64,
            increment: 1,
            id: 8,
            colorType: 2
        }
    ],
    TattooGroup: [
        {
            label: 'MPBUSINESS_0',
            key: 'mpbusiness_0',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Neck_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_1',
            key: 'mpbusiness_1',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Neck_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_2',
            key: 'mpbusiness_2',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Neck_002',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_3',
            key: 'mpbusiness_3',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Neck_003',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_4',
            key: 'mpbusiness_4',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_LeftArm_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_5',
            key: 'mpbusiness_5',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_LeftArm_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_6',
            key: 'mpbusiness_6',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_RightArm_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_7',
            key: 'mpbusiness_7',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_RightArm_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_8',
            key: 'mpbusiness_8',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Stomach_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_9',
            key: 'mpbusiness_9',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Chest_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_10',
            key: 'mpbusiness_10',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Chest_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_11',
            key: 'mpbusiness_11',
            tattoo: 'mpbusiness_overlays@MP_Buis_M_Back_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_12',
            key: 'mpbusiness_12',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Chest_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_13',
            key: 'mpbusiness_13',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Chest_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_14',
            key: 'mpbusiness_14',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Chest_002',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_15',
            key: 'mpbusiness_15',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Stom_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_16',
            key: 'mpbusiness_16',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Stom_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_17',
            key: 'mpbusiness_17',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Stom_002',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_18',
            key: 'mpbusiness_18',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Back_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_19',
            key: 'mpbusiness_19',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Back_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_20',
            key: 'mpbusiness_20',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Neck_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_21',
            key: 'mpbusiness_21',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_Neck_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_22',
            key: 'mpbusiness_22',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_RArm_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_23',
            key: 'mpbusiness_23',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_LArm_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_24',
            key: 'mpbusiness_24',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_LLeg_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBUSINESS_25',
            key: 'mpbusiness_25',
            tattoo: 'mpbusiness_overlays@MP_Buis_F_RLeg_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_0',
            key: 'mphipster_0',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_1',
            key: 'mphipster_1',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_2',
            key: 'mphipster_2',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_002',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_3',
            key: 'mphipster_3',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_003',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_4',
            key: 'mphipster_4',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_004',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_5',
            key: 'mphipster_5',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_005',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_6',
            key: 'mphipster_6',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_006',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_7',
            key: 'mphipster_7',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_007',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_8',
            key: 'mphipster_8',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_008',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_9',
            key: 'mphipster_9',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_009',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_10',
            key: 'mphipster_10',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_010',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_11',
            key: 'mphipster_11',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_011',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_12',
            key: 'mphipster_12',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_012',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_13',
            key: 'mphipster_13',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_013',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_14',
            key: 'mphipster_14',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_014',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_15',
            key: 'mphipster_15',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_015',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_16',
            key: 'mphipster_16',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_016',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_17',
            key: 'mphipster_17',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_017',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_18',
            key: 'mphipster_18',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_018',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_19',
            key: 'mphipster_19',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_019',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_20',
            key: 'mphipster_20',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_020',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_21',
            key: 'mphipster_21',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_021',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_22',
            key: 'mphipster_22',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_022',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_23',
            key: 'mphipster_23',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_023',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_24',
            key: 'mphipster_24',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_024',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_25',
            key: 'mphipster_25',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_025',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_26',
            key: 'mphipster_26',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_026',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_27',
            key: 'mphipster_27',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_027',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_28',
            key: 'mphipster_28',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_028',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_29',
            key: 'mphipster_29',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_029',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_30',
            key: 'mphipster_30',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_030',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_31',
            key: 'mphipster_31',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_031',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_32',
            key: 'mphipster_32',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_032',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_33',
            key: 'mphipster_33',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_033',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_34',
            key: 'mphipster_34',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_034',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_35',
            key: 'mphipster_35',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_035',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_36',
            key: 'mphipster_36',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_036',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_37',
            key: 'mphipster_37',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_037',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_38',
            key: 'mphipster_38',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_038',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_39',
            key: 'mphipster_39',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_039',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_40',
            key: 'mphipster_40',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_040',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_41',
            key: 'mphipster_41',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_041',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_42',
            key: 'mphipster_42',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_042',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_43',
            key: 'mphipster_43',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_043',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_44',
            key: 'mphipster_44',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_044',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_45',
            key: 'mphipster_45',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_045',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_46',
            key: 'mphipster_46',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_046',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_47',
            key: 'mphipster_47',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_047',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPHIPSTER_48',
            key: 'mphipster_48',
            tattoo: 'mphipster_overlays@FM_Hip_M_Tat_048',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_0',
            key: 'mpbiker_0',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_000_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_1',
            key: 'mpbiker_1',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_001_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_2',
            key: 'mpbiker_2',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_002_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_3',
            key: 'mpbiker_3',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_003_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_4',
            key: 'mpbiker_4',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_004_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_5',
            key: 'mpbiker_5',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_005_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_6',
            key: 'mpbiker_6',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_006_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_7',
            key: 'mpbiker_7',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_007_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_8',
            key: 'mpbiker_8',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_008_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_9',
            key: 'mpbiker_9',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_009_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_10',
            key: 'mpbiker_10',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_010_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_11',
            key: 'mpbiker_11',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_011_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_12',
            key: 'mpbiker_12',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_012_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_13',
            key: 'mpbiker_13',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_013_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_14',
            key: 'mpbiker_14',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_014_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_15',
            key: 'mpbiker_15',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_015_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_16',
            key: 'mpbiker_16',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_016_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_17',
            key: 'mpbiker_17',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_017_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_18',
            key: 'mpbiker_18',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_018_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_19',
            key: 'mpbiker_19',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_019_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_20',
            key: 'mpbiker_20',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_020_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_21',
            key: 'mpbiker_21',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_021_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_22',
            key: 'mpbiker_22',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_022_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_23',
            key: 'mpbiker_23',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_023_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_24',
            key: 'mpbiker_24',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_024_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_25',
            key: 'mpbiker_25',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_025_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_26',
            key: 'mpbiker_26',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_026_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_27',
            key: 'mpbiker_27',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_027_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_28',
            key: 'mpbiker_28',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_028_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_29',
            key: 'mpbiker_29',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_029_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_30',
            key: 'mpbiker_30',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_030_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_31',
            key: 'mpbiker_31',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_031_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_32',
            key: 'mpbiker_32',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_032_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_33',
            key: 'mpbiker_33',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_033_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_34',
            key: 'mpbiker_34',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_034_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_35',
            key: 'mpbiker_35',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_035_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_36',
            key: 'mpbiker_36',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_036_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_37',
            key: 'mpbiker_37',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_037_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_38',
            key: 'mpbiker_38',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_038_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_39',
            key: 'mpbiker_39',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_039_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_40',
            key: 'mpbiker_40',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_040_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_41',
            key: 'mpbiker_41',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_041_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_42',
            key: 'mpbiker_42',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_042_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_43',
            key: 'mpbiker_43',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_043_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_44',
            key: 'mpbiker_44',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_044_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_45',
            key: 'mpbiker_45',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_045_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_46',
            key: 'mpbiker_46',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_046_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_47',
            key: 'mpbiker_47',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_047_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_48',
            key: 'mpbiker_48',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_048_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_49',
            key: 'mpbiker_49',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_049_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_50',
            key: 'mpbiker_50',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_050_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_51',
            key: 'mpbiker_51',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_051_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_52',
            key: 'mpbiker_52',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_052_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_53',
            key: 'mpbiker_53',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_053_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_54',
            key: 'mpbiker_54',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_054_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_55',
            key: 'mpbiker_55',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_055_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_56',
            key: 'mpbiker_56',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_056_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_57',
            key: 'mpbiker_57',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_057_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_58',
            key: 'mpbiker_58',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_058_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_59',
            key: 'mpbiker_59',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_059_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBIKER_60',
            key: 'mpbiker_60',
            tattoo: 'mpbiker_overlays@MP_MP_Biker_Tat_060_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_0',
            key: 'mpairraces_0',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_000_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_1',
            key: 'mpairraces_1',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_001_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_2',
            key: 'mpairraces_2',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_002_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_3',
            key: 'mpairraces_3',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_003_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_4',
            key: 'mpairraces_4',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_004_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_5',
            key: 'mpairraces_5',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_005_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_6',
            key: 'mpairraces_6',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_006_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPAIRRACES_7',
            key: 'mpairraces_7',
            tattoo: 'mpairraces_overlays@MP_Airraces_Tattoo_007_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_0',
            key: 'mpbeach_0',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Back_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_1',
            key: 'mpbeach_1',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Chest_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_2',
            key: 'mpbeach_2',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Chest_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_3',
            key: 'mpbeach_3',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Head_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_4',
            key: 'mpbeach_4',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Head_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_5',
            key: 'mpbeach_5',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Head_002',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_6',
            key: 'mpbeach_6',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Lleg_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_7',
            key: 'mpbeach_7',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Rleg_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_8',
            key: 'mpbeach_8',
            tattoo: 'mpbeach_overlays@MP_Bea_M_RArm_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_9',
            key: 'mpbeach_9',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Head_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_10',
            key: 'mpbeach_10',
            tattoo: 'mpbeach_overlays@MP_Bea_M_LArm_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_11',
            key: 'mpbeach_11',
            tattoo: 'mpbeach_overlays@MP_Bea_M_LArm_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_12',
            key: 'mpbeach_12',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Neck_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_13',
            key: 'mpbeach_13',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Neck_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_14',
            key: 'mpbeach_14',
            tattoo: 'mpbeach_overlays@MP_Bea_M_RArm_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_15',
            key: 'mpbeach_15',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Stom_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPBEACH_16',
            key: 'mpbeach_16',
            tattoo: 'mpbeach_overlays@MP_Bea_M_Stom_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_0',
            key: 'mpchristmas2_0',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_000',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_1',
            key: 'mpchristmas2_1',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_001',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_2',
            key: 'mpchristmas2_2',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_003',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_3',
            key: 'mpchristmas2_3',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_004',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_4',
            key: 'mpchristmas2_4',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_005',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_5',
            key: 'mpchristmas2_5',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_006',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_6',
            key: 'mpchristmas2_6',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_007',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_7',
            key: 'mpchristmas2_7',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_008',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_8',
            key: 'mpchristmas2_8',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_009',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_9',
            key: 'mpchristmas2_9',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_010',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_10',
            key: 'mpchristmas2_10',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_011',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_11',
            key: 'mpchristmas2_11',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_012',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_12',
            key: 'mpchristmas2_12',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_013',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_13',
            key: 'mpchristmas2_13',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_014',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_14',
            key: 'mpchristmas2_14',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_015',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_15',
            key: 'mpchristmas2_15',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_016',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_16',
            key: 'mpchristmas2_16',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_017',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_17',
            key: 'mpchristmas2_17',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_018',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_18',
            key: 'mpchristmas2_18',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_019',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_19',
            key: 'mpchristmas2_19',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_022',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_20',
            key: 'mpchristmas2_20',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_023',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_21',
            key: 'mpchristmas2_21',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_024',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_22',
            key: 'mpchristmas2_22',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_025',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_23',
            key: 'mpchristmas2_23',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_026',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_24',
            key: 'mpchristmas2_24',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_027',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_25',
            key: 'mpchristmas2_25',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_028',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPCHRISTMAS2_26',
            key: 'mpchristmas2_26',
            tattoo: 'mpchristmas2_overlays@MP_Xmas2_M_Tat_029',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_0',
            key: 'mpgunrunning_0',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_000_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_1',
            key: 'mpgunrunning_1',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_001_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_2',
            key: 'mpgunrunning_2',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_002_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_3',
            key: 'mpgunrunning_3',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_003_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_4',
            key: 'mpgunrunning_4',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_004_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_5',
            key: 'mpgunrunning_5',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_005_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_6',
            key: 'mpgunrunning_6',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_006_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_7',
            key: 'mpgunrunning_7',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_007_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_8',
            key: 'mpgunrunning_8',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_008_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_9',
            key: 'mpgunrunning_9',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_009_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_10',
            key: 'mpgunrunning_10',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_010_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_11',
            key: 'mpgunrunning_11',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_011_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_12',
            key: 'mpgunrunning_12',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_012_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_13',
            key: 'mpgunrunning_13',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_013_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_14',
            key: 'mpgunrunning_14',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_014_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_15',
            key: 'mpgunrunning_15',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_015_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_16',
            key: 'mpgunrunning_16',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_016_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_17',
            key: 'mpgunrunning_17',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_017_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_18',
            key: 'mpgunrunning_18',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_018_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_19',
            key: 'mpgunrunning_19',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_019_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_20',
            key: 'mpgunrunning_20',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_020_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_21',
            key: 'mpgunrunning_21',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_021_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_22',
            key: 'mpgunrunning_22',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_022_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_23',
            key: 'mpgunrunning_23',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_023_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_24',
            key: 'mpgunrunning_24',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_024_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_25',
            key: 'mpgunrunning_25',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_025_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_26',
            key: 'mpgunrunning_26',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_026_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_27',
            key: 'mpgunrunning_27',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_027_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_28',
            key: 'mpgunrunning_28',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_028_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_29',
            key: 'mpgunrunning_29',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_029_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPGUNRUNNING_30',
            key: 'mpgunrunning_30',
            tattoo: 'mpgunrunning_overlays@MP_Gunrunning_Tattoo_030_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_0',
            key: 'mpimportexport_0',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_000_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_1',
            key: 'mpimportexport_1',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_001_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_2',
            key: 'mpimportexport_2',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_002_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_3',
            key: 'mpimportexport_3',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_003_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_4',
            key: 'mpimportexport_4',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_004_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_5',
            key: 'mpimportexport_5',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_005_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_6',
            key: 'mpimportexport_6',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_006_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_7',
            key: 'mpimportexport_7',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_007_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_8',
            key: 'mpimportexport_8',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_008_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_9',
            key: 'mpimportexport_9',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_009_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_10',
            key: 'mpimportexport_10',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_010_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPIMPORTEXPORT_11',
            key: 'mpimportexport_11',
            tattoo: 'mpimportexport_overlays@MP_MP_ImportExport_Tat_011_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_0',
            key: 'mplowrider2_0',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_000_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_1',
            key: 'mplowrider2_1',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_003_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_2',
            key: 'mplowrider2_2',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_006_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_3',
            key: 'mplowrider2_3',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_008_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_4',
            key: 'mplowrider2_4',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_011_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_5',
            key: 'mplowrider2_5',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_012_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_6',
            key: 'mplowrider2_6',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_016_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_7',
            key: 'mplowrider2_7',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_018_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_8',
            key: 'mplowrider2_8',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_019_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_9',
            key: 'mplowrider2_9',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_022_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_10',
            key: 'mplowrider2_10',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_028_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_11',
            key: 'mplowrider2_11',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_029_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_12',
            key: 'mplowrider2_12',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_030_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_13',
            key: 'mplowrider2_13',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_031_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_14',
            key: 'mplowrider2_14',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_032_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER2_15',
            key: 'mplowrider2_15',
            tattoo: 'mplowrider2_overlays@MP_LR_Tat_035_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_0',
            key: 'mplowrider_0',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_001_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_1',
            key: 'mplowrider_1',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_002_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_2',
            key: 'mplowrider_2',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_004_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_3',
            key: 'mplowrider_3',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_005_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_4',
            key: 'mplowrider_4',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_007_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_5',
            key: 'mplowrider_5',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_009_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_6',
            key: 'mplowrider_6',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_010_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_7',
            key: 'mplowrider_7',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_013_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_8',
            key: 'mplowrider_8',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_014_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_9',
            key: 'mplowrider_9',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_015_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_10',
            key: 'mplowrider_10',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_017_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_11',
            key: 'mplowrider_11',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_020_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_12',
            key: 'mplowrider_12',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_021_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_13',
            key: 'mplowrider_13',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_023_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_14',
            key: 'mplowrider_14',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_026_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_15',
            key: 'mplowrider_15',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_027_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        },
        {
            label: 'MPLOWRIDER_16',
            key: 'mplowrider_16',
            tattoo: 'mplowrider_overlays@MP_LR_Tat_033_M',
            value: 0,
            min: 0,
            max: 1,
            increment: 1
        }
    ]
};
