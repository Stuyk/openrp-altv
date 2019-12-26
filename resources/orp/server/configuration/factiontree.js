import * as alt from 'alt';
import fs from 'fs';

// Break down weapons into raw materials on death

// Faction Types
const SubTypes = {
    MIN: 0,
    BUSINESS: 1,
    GANG: 2,
    POLICE: 4,
    FBI: 8,
    SWAT: 16,
    FIRE: 32,
    HMA: 64,
    NEWS: 128
};

// Unlockable Skills
const Unlocks = {
    MIN: 0,
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
    GLOBAL_BROADCAST: 134217728 // Weazel News
};

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
        Unlocks.CAN_ARREST |
        Unlocks.PISTOL_LOCKER |
        Unlocks.SHOTGUN_LOCKER |
        Unlocks.UTILITY_LOCKER |
        Unlocks.ARMOUR_LOCKER |
        Unlocks.OUTFIT_LOCKER |
        Unlocks.EXPLOSIVE_LOCKER |
        Unlocks.CAN_INVESTIGATE |
        Unlocks.CAN_DISGUISE |
        Unlocks.DEPARTMENT_RADIO
};

// Their Powers
const SubTypeDefaults = {};

// Minimum Reward Points Per Unlock
const VehicleUnlocks = {
    MIN: 1024,
    TWO: 2048,
    THREE: 4096,
    FOUR: 8192,
    FIVE: 16384,
    SIX: 32768,
    SEVEN: 65536,
    EIGHT: 131072,
    NINE: 262144,
    TEN: 524288,
    MAX: 1047552
};

// Minimum Reward Points Per Unlock
const AircraftUnlocks = {
    MIN: 16384,
    TWO: 32768,
    MAX: 65536
};

const standardGang = {
    radio: {
        description: 'A faction designated chat.',
        requirement: 250
    },
    vehicle0: {
        description: 'Unlock a faction vehicle.',
        requirement: 500
    },
    vehicle1: {
        description: 'Unlock a faction vehicle.',
        requirement: 1000
    },
    vehicle2: {
        description: 'Unlock a faction vehicle.',
        requirement: 2000
    },
    recon: {
        description: 'Able to see all faction members online.',
        requirement: 3500
    },
    vehicle3: {
        description: 'Unlock a faction vehicle.',
        requirement: 4000
    },
    vehicle4: {
        description: 'Unlock a faction vehicle.',
        requirement: 8000
    },
    vehicle5: {
        description: 'Unlock a faction vehicle.',
        requirement: 16000
    },
    aircraft: {
        description: 'Unlock a faction aircraft.',
        requirement: 32000
    },
    warehouse: {
        description: 'Gain access to a faction warehouse for storing items.',
        requirement: 38000
    }
};

const standardBusiness = {
    endpoint: {
        description: 'A special textable line for users talk to your business members.',
        requirement: 100
    },
    radio: {
        description: 'A faction designated chat.',
        requirement: 250
    },
    warehouse: {
        description: 'Gain access to a faction warehouse for storing items.',
        requirement: 500
    },
    vehicle0: {
        description: 'Unlock a faction vehicle.',
        requirement: 500
    },
    vehicle1: {
        description: 'Unlock a faction vehicle.',
        requirement: 1000
    },
    vehicle2: {
        description: 'Unlock a faction vehicle.',
        requirement: 2000
    },
    recon: {
        description: 'Able to see all faction members online.',
        requirement: 3500
    },
    vehicle3: {
        description: 'Unlock a faction vehicle.',
        requirement: 4000
    },
    vehicle4: {
        description: 'Unlock a faction vehicle.',
        requirement: 8000
    },
    vehicle5: {
        description: 'Unlock a faction vehicle.',
        requirement: 16000
    },
    aircraft: {
        description: 'Unlock a faction aircraft.',
        requirement: 32000
    }
};

const standardFaction = {
    recon: {
        description: 'Able to see all faction members online.',
        requirement: 200
    },
    radio: {
        description: 'A faction designated chat.',
        requirement: 250
    },
    fvehicle0: {
        description: 'Unlock a faction vehicle.',
        requirement: 500
    },
    fvehicle1: {
        description: 'Unlock a faction vehicle.',
        requirement: 1000
    },
    fvehicle2: {
        description: 'Unlock a faction vehicle.',
        requirement: 2000
    },
    fvehicle3: {
        description: 'Unlock a faction vehicle.',
        requirement: 4000
    },
    fvehicle4: {
        description: 'Unlock a faction vehicle.',
        requirement: 8000
    },
    fvehicle5: {
        description: 'Unlock a faction vehicle.',
        requirement: 16000
    },
    faircraft: {
        description: 'Unlock a faction aircraft.',
        requirement: 32000
    },
    paybonus0: {
        description: 'All members recieve a $5 paycheck bonus.',
        requirement: 250000
    },
    paybonus1: {
        description: 'All members recieve a $5 paycheck bonus.',
        requirement: 500000
    }
};

// Main Faction Branch by Type ie. Gang, Police, etc.
// Sub-Faction Type by Activity
// Requirements are based on rewardpoints.
// Rewardpoints are earned every 5 minutes in-game.
// There are 12 reward points in 1 hour.
// There are 288 reward points in a 24 hour period.
// Members combine reward points to unlock faction skills.
export const SkillTree = {
    // Gang
    0: {
        // Access to Gun Runnning Jobs
        gun: {
            desc: 'Gain access to gun running jobs with primary focus on the gun trade.',
            ...standardGang,
            main: {
                description: 'Access to gun running jobs.',
                requirement: 1
            }
        },
        // Access to Drug Running Jobs
        drug: {
            desc:
                'Gain access to drug running jobs with primary focus on the drug trade.',
            ...standardGang,
            main: {
                description: 'Access to drug running jobs.',
                requirement: 1
            }
        }
    },
    // Police
    1: {
        fbi: {
            desc:
                'Your team will investigate murders and assist police with finding a killer.',
            ...standardFaction,
            main: {
                description: 'Investigate corpses information on a killer.',
                requirement: 1
            }
        },
        police: {
            desc:
                'Your responsibility is to capture wanted criminals and maintain order.',
            ...standardFaction,
            main: {
                description:
                    'Standard police faction. Arrest other players. Access to MDC.',
                requirement: 1
            }
        },
        swat: {
            desc:
                'Your factions responsibility is to help police neutralize heavily occupied turfs from gang activity.',
            ...standardFaction,
            main: {
                description: 'Access to heavy weaponry.',
                requirement: 1
            }
        }
    },
    // EMS
    2: {
        firefighter: {
            desc: 'Put out fires and restore functionality to stores, jobs, etc.',
            ...standardFaction,
            main: {
                description: 'Retrieve locations of on-going fires.',
                requirement: 1
            }
        },
        ems: {
            desc: 'Retrieve downed civilians.',
            ...standardFaction,
            main: {
                description: 'Retrieve and revive players. Recieve EMS calls.',
                requirement: 1
            }
        }
    },
    // Business
    3: {
        business: {
            desc: 'Start a business based on the item trading or any other service.',
            ...standardBusiness
        }
    }
};

alt.on('faction:SetSkillTree', player => {
    player.emitMeta('faction:SkillTree', JSON.stringify(SkillTree));
});
