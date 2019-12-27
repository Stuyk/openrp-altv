// Break down weapons into raw materials on death
// Faction Types
export const SubTypes = {
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

export const PoliceTypes = [
    SubTypes.POLICE,
    SubTypes.SHERIFF,
    SubTypes.SWAT,
    SubTypes.FBI
];

// Unlockable Skills
export const Unlocks = {
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

export const UnlockPoints = {
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
export const SubTypeAccess = {
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
        Unlocks.KNIFE_LOCKER |
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
export function isSkillUnlocked(skillNumber, factionPoints) {
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
        return 1;
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
export function getDefaultUnlocks(subTypeNumber) {
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
export function getPointsNeeded(skillNumber) {
    if (!UnlockPoints[skillNumber]) {
        return -1;
    }

    return UnlockPoints[skillNumber];
}
