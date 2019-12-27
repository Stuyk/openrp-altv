// Break down weapons into raw materials on death
// Faction Types
const SubTypes = {
    BUSINESS: 1,
    GANG: 2,
    POLICE: 4,
    FBI: 8,
    SWAT: 16,
    SHERIFF: 32,
    FIRE: 64,
    HMA: 128,
    NEWS: 256
};

const PoliceTypes = [SubTypes.POLICE, SubTypes.SHERIFF, SubTypes.SWAT, SubTypes.FBI];

// Unlockable Skills
const Unlocks = {
    CHAT: 1, // Private Chat for Members
    RADIO: 2, // Radio for Members (IC)
    RECON: 4, // See Own Members
    WAREHOUSE: 8, // Faction Warehouse for Shared Storage
    VEHICLE: 16, // Vehicle Unlocks
    AIRCRAFT: 32, // Aircraft Unlocks
    DRUG_JOBS: 64, // Unlock Drug Jobs
    GUN_JOBS: 128, // Unlock Gun Jobs
    CAN_ARREST: 256, // Can Arrest Players
    CAN_INVESTIGATE: 512, // Can Investigate Dead Bodies, See Random Items in Warehouse with Cooldown
    PISTOL_LOCKER: 1024, // Unlock Pistols
    SUB_MACHINE_LOCKER: 2048, // Unlock Submachine Guns
    SHOTGUN_LOCKER: 4096, // Unlock Shotguns
    ASSAULT_LOCKER: 8192, // Unlock Assault Rifles
    EXPLOSIVE_LOCKER: 16384, // Unlock Explosives
    UTILITY_LOCKER: 32768, // Unlock Tazer, Parachute, Flashlight, Fire Ext, etc.
    ARMOUR_LOCKER: 65536, // Access to Armor
    OUTFIT_LOCKER: 131072, // Access to Predefined Outfits by Leader
    CAN_SPY: 262144, // Bug Players, Vehicles, etc.
    CAN_DISGUISE: 524288, // Can Change Name Anywhere - Fake ID
    IGNORE_SAFEZONE: 1048576, // Ignores Safe Zone for Combat
    DEPARTMENT_RADIO: 2097152, // Talk across other factions that have this flag.
    TEXT_LINE: 4194304, // Text a specific WORD to relay it to all members.
    CAN_BE_RAIDED: 8388608, // Warehouse can be raided
    CAN_RAID: 16777216, // Can raid warehouses
    CAN_RESTORE: 33554432, // Can restore destroyed by fire points.
    CAN_BADGE: 67108864, // Can Faction Badge Up
    GLOBAL_BROADCAST: 134217728, // Weazel News
    KNIFE_LOCKER: 268435456 // Knoife
};

const UnlocksDesc = {
    [Unlocks.CHAT]: 'Unlocks a Private Chat for Faction Members',
    [Unlocks.RADIO]: 'Unlocks a Radio Chat for Faction Members',
    [Unlocks.RECON]: 'Unlocks the ability to see online Faction Members on the map',
    [Unlocks.WAREHOUSE]: 'Unlocks a shared Faction Warehouse to store items',
    [Unlocks.VEHICLE]: 'Unlocks shared vehicle slots',
    [Unlocks.AIRCRAFT]: 'Unlocks shared aircraft slots ',
    [Unlocks.DRUG_JOBS]: 'Unlocks the ability to do jobs involving drugs',
    [Unlocks.GUN_JOBS]: 'Unlocks the ability to do jobs involving guns',
    [Unlocks.CAN_ARREST]: 'Unlocks the ability to arrest other players',
    [Unlocks.CAN_INVESTIGATE]: 'Unlocks the ability to do jobs involving drugs',
    [Unlocks.PISTOL_LOCKER]:
        'Unlocks a pistol locker where Faction Members can get pistols',
    [Unlocks.SUB_MACHINE_LOCKER]:
        'Unlocks a sub machine locker where Faction Members can get sub machine guns',
    [Unlocks.SHOTGUN_LOCKER]:
        'Unlocks a shotgun locker where Faction Members can get shotguns',
    [Unlocks.ASSAULT_LOCKER]:
        'Unlocks an assult rifle locker where Faction Members can get assault rifles',
    [Unlocks.EXPLOSIVE_LOCKER]:
        'Unlocks an explosives locker where Faction Members can get explosives',
    [Unlocks.UTILITY_LOCKER]:
        'Unlocks a utility locker where Faction Members can get utilities',
    [Unlocks.ARMOUR_LOCKER]:
        'Unlocks an armor locker where Faction Members can get armor',
    [Unlocks.OUTFIT_LOCKER]:
        'Unlocks an outfit locker where Faction Members can get outfits',
    [Unlocks.CAN_SPY]:
        'Unlocks the ability to place bugs on players or vehicles and "hear" their chats for a certain amount of time',
    [Unlocks.CAN_DISGUISE]:
        'Unlocks the ability for Faction Members to change their names',
    [Unlocks.IGNORE_SAFEZONE]:
        'Unlocks the ability to get involved in a combat in safezones',
    [Unlocks.DEPARTMENT_RADIO]:
        'Unlocks the ability to chat with other factions that also have this ability',
    [Unlocks.TEXT_LINE]:
        'Unlocks the ability to send a one WORD alert to all Faction Members',
    [Unlocks.CAN_BE_RAIDED]: "Allows for the faction's warehouse to be raided",
    [Unlocks.CAN_RAID]: "Gives the ability to raid another faction's warehouse",
    [Unlocks.CAN_RESTORE]: 'Ability to restore burned down warehouses, stores, etc',
    [Unlocks.CAN_BADGE]:
        'Allows for the faction to have a uniform and a specific name color',
    [Unlocks.GLOBAL_BROADCAST]: 'Can send notifications to all online players',
    [Unlocks.KNIFE_LOCKER]: 'Unlocks a knife locker where Faction Members can get knives'
};

const UnlockPoints = {
    [Unlocks.CHAT]: 200,
    [Unlocks.RADIO]: 400,
    [Unlocks.RECON]: 1000,
    [Unlocks.WAREHOUSE]: 3200,
    [Unlocks.VEHICLE]: [
        1024,
        2048,
        4096,
        8192,
        16384,
        32768,
        65536,
        131072,
        262144,
        524288,
        1047552
    ],
    [Unlocks.AIRCRAFT]: [16384, 32768, 65536],
    [Unlocks.DRUG_JOBS]: 1200,
    [Unlocks.GUN_JOBS]: 1200,
    [Unlocks.CAN_ARREST]: -1,
    [Unlocks.CAN_INVESTIGATE]: -1,
    [Unlocks.PISTOL_LOCKER]: -1,
    [Unlocks.SUB_MACHINE_LOCKER]: 3000,
    [Unlocks.SHOTGUN_LOCKER]: 3000,
    [Unlocks.ASSAULT_LOCKER]: 4500,
    [Unlocks.EXPLOSIVE_LOCKER]: 6500,
    [Unlocks.UTILITY_LOCKER]: 1000,
    [Unlocks.ARMOUR_LOCKER]: 2500,
    [Unlocks.OUTFIT_LOCKER]: -1,
    [Unlocks.CAN_SPY]: -1,
    [Unlocks.CAN_DISGUISE]: -1,
    [Unlocks.IGNORE_SAFEZONE]: -1,
    [Unlocks.DEPARTMENT_RADIO]: -1,
    [Unlocks.TEXT_LINE]: -1,
    [Unlocks.CAN_BE_RAIDED]: -1,
    [Unlocks.CAN_RAID]: -1,
    [Unlocks.CAN_RESTORE]: -1,
    [Unlocks.CAN_BADGE]: -1,
    [Unlocks.GLOBAL_BROADCAST]: -1,
    [Unlocks.KNIFE_LOCKER]: -1
};

// Basic Faction Data
const SubTypeAccess = {
    [SubTypes.BUSINESS]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.UTILITY_LOCKER |
        Unlocks.TEXT_LINE |
        Unlocks.CAN_BE_RAIDED,
    [SubTypes.GANG]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.DRUG_JOBS |
        Unlocks.GUN_JOBS |
        Unlocks.UTILITY_LOCKER |
        Unlocks.CAN_BE_RAIDED,
    [SubTypes.POLICE]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.CAN_ARREST |
        Unlocks.PISTOL_LOCKER |
        Unlocks.SHOTGUN_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.DEPARTMENT_RADIO,
    [SubTypes.FBI]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.CAN_ARREST |
        Unlocks.PISTOL_LOCKER |
        Unlocks.SHOTGUN_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.CAN_DISGUISE |
        Unlocks.CAN_INVESTIGATE |
        Unlocks.CAN_SPY |
        Unlocks.DEPARTMENT_RADIO,
    [SubTypes.SWAT]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.PISTOL_LOCKER |
        Unlocks.SHOTGUN_LOCKER |
        Unlocks.SUB_MACHINE_LOCKER |
        Unlocks.ASSAULT_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.DEPARTMENT_RADIO |
        Unlocks.CAN_RAID,
    [SubTypes.FIRE]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.DEPARTMENT_RADIO,
    [SubTypes.HMA]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.VEHICLE |
        Unlocks.AIRCRAFT |
        Unlocks.PISTOL_LOCKER |
        Unlocks.SHOTGUN_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.EXPLOSIVE_LOCKER |
        Unlocks.CAN_INVESTIGATE |
        Unlocks.CAN_DISGUISE
};

const SubTypeDefaults = {
    [SubTypes.BUSINESS]: Unlocks.CAN_BE_RAIDED,
    [SubTypes.GANG]: Unlocks.CAN_BE_RAIDED,
    [SubTypes.POLICE]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.CAN_ARREST |
        Unlocks.PISTOL_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.DEPARTMENT_RADIO,
    [SubTypes.FBI]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.PISTOL_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.CAN_DISGUISE |
        Unlocks.CAN_INVESTIGATE |
        Unlocks.CAN_SPY |
        Unlocks.DEPARTMENT_RADIO,
    [SubTypes.SWAT]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.WAREHOUSE |
        Unlocks.PISTOL_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.DEPARTMENT_RADIO |
        Unlocks.CAN_RAID,
    [SubTypes.FIRE]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.WAREHOUSE |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.DEPARTMENT_RADIO,
    [SubTypes.HMA]:
        Unlocks.CHAT |
        Unlocks.RADIO |
        Unlocks.RECON |
        Unlocks.PISTOL_LOCKER |
        Unlocks.KNIFE_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.CAN_INVESTIGATE |
        Unlocks.CAN_DISGUISE
};

/**
 * Check if a skill is unlocked by number.
 * @param {Unlocks} skillName
 * @param {Number} factionPoints
 * @returns {Number} Number of unlocks. 0 = Locked, 1 = Unlocked, +1 = Available Slots
 */
function isSkillUnlocked(skillNumber, factionPoints) {
    if (!UnlockPoints[skillNumber]) {
        return 0;
    }

    if (Array.isArray(UnlockPoints[skillNumber])) {
        const unlocks = UnlockPoints[skillNumber];
        let totalUnlocks = 0;
        unlocks.forEach(unlock => {
            if (factionPoints >= unlock) {
                totalUnlocks += 1;
            }
        });

        return totalUnlocks;
    }

    if (UnlockPoints[skillNumber] <= -1) {
        return 0;
    }

    if (factionPoints < UnlockPoints[skillNumber]) {
        return 0;
    }

    return 1;
}

/**
 * Get the default unlockables for a subtype.
 * @param {SubTypes} subTypeName
 */
function getDefaultUnlocks(subTypeNumber) {
    if (!SubTypeDefaults[subTypeNumber]) {
        console.log(`Faction subtype: ${subTypeNumber} does not exist.`);
        return 0;
    }

    return SubTypeDefaults[subTypeNumber];
}

/**
 * Get the number necessary to unlock a skill.
 * @param {Unlocks} skillNumber
 */
function getPointsNeeded(skillNumber) {
    if (!UnlockPoints[skillNumber]) {
        return -1;
    }

    return UnlockPoints[skillNumber];
}

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: 1
        };
    }

    appendPoint(e) {
        const id = parseInt(e.target.id);
        const amount = parseInt(e.target.value);

        if ('alt' in window) {
            alt.emit('faction:AppendPoint', id, amount);
        } else {
            console.log('id / amount');
            console.log(id);
            console.log(amount);
        }
    }

    updatePointAllocator(points) {
        this.setState({ points });
    }

    renderSubSkills({ props }) {
        const state = props.state;
        const availableUnlocks = SubTypeAccess[state.subtype];
        const available = Object.keys(Unlocks).filter(unlock => {
            if (isFlagged(availableUnlocks, Unlocks[unlock])) {
                return unlock;
            }
        });

        const unlockables = available.map((unlock, index) => {
            // Modify Theme for Row
            const unlockStyle = index % 2 === 0 ? 'dark' : 'light';

            // Get Unlock Points for Undefined
            let unlockPoints =
                state.unlocks[Unlocks[unlock]] >= 0 ? state.unlocks[Unlocks[unlock]] : 0;

            // Check if default unlock.
            const pointsNeeded = getPointsNeeded(Unlocks[unlock]);
            if (pointsNeeded <= -1) {
                unlockPoints = -1;
            }

            // Check if Array Unlock Type
            const pointData = Array.isArray(pointsNeeded)
                ? pointsNeeded.find(points => {
                      if (points >= unlockPoints) {
                          if (points !== unlockPoints) {
                              return points;
                          }
                      }
                  })
                : pointsNeeded;

            let maxPointSpend = this.state.points;
            if (this.state.points > pointData - unlockPoints) {
                maxPointSpend = pointData - unlockPoints;
            }

            let buttonType = h('button', { class: 'disabled' }, 'No Points Available');

            if (unlockPoints === pointData || unlockPoints <= -1 || !pointData) {
                buttonType = h('button', { class: 'unlocked' }, 'Unlocked');
            }

            if (
                state.rewardPoints >= 1 &&
                unlockPoints !== pointData &&
                unlockPoints >= 0
            ) {
                buttonType = h(
                    'button',
                    {
                        class: 'appendPoint',
                        id: Unlocks[unlock],
                        onclick: this.appendPoint.bind(this),
                        value: maxPointSpend
                    },
                    `Use ${maxPointSpend} Point(s)`
                );
            }

            // Get Description for Unlock
            const pointDesc = UnlocksDesc[Unlocks[unlock]];

            // Glue Together
            return h(
                'div',
                { class: `unlock ${unlockStyle}` },
                h(
                    'div',
                    { class: 'header' },
                    h(
                        'div',
                        { class: 'name' },
                        `${unlock} [${unlockPoints}/${
                            pointData ? pointData : unlockPoints
                        }]`
                    ),
                    buttonType
                ),
                h('div', { class: 'footer' }, h('p', {}, pointDesc))
            );
        });
        return h('div', { class: 'unlocks' }, unlockables);
    }

    render(props) {
        const subTypeName = Object.keys(SubTypes).find(key => {
            if (SubTypes[key] === props.state.subtype) {
                return key;
            }
        });

        const rewardPoints = props.state.rewardPoints;

        return h(
            'div',
            { class: 'skillPage' },
            rewardPoints >= 1 &&
                h(
                    'div',
                    { class: 'pointAllocation' },
                    h('p', {}, `You have ${rewardPoints} Point(s) Available.`),
                    h(
                        'p',
                        {},
                        'Allocate points to your faction to unlock new features. Points that are spent will not be regained if the faction disbands.'
                    ),
                    h('input', {
                        id: 'pointAllocator',
                        type: 'range',
                        min: 1,
                        max: rewardPoints,
                        value: this.state.points,
                        oninput: e => {
                            const value = e.target.value;
                            this.updatePointAllocator(value);
                        }
                    })
                ),
            h(this.renderSubSkills.bind(this), { props })
        );
    }
}
