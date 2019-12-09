import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { colshapes } from './grid.mjs';
import { Config } from '../configuration/config.mjs';
import { isFlagged } from '../utility/flags.mjs';

const factions = [];
const db = new SQL();
const defaultRanks = [{ name: 'Owner', flags: 7 }, { name: 'Recruit', flags: 0 }];
const classifications = {
    GANG: 0,
    POLICE: 1,
    EMS: 2,
    BUSINESS: 3
};
const permissions = {
    MIN: 0,
    RECRUIT: 1,
    KICK: 2,
    PROMOTE: 4,
    MAX: 7
};
// Requirements are based on player reward points.
// Reward points are non-refundable.
const factionSkills = {
    0: {
        name: 'Armour Bonus on Respawn',
        event: 'skill:RespawnArmour',
        requirement: 900
    },
    1: {
        name: '5x Faction Vehicle',
        event: 'skill:RespawnVehicles',
        requirement: 1800
    },
    2: {
        name: '5x Faction Vehicle',
        event: 'skill:RespawnVehicles',
        requirement: 1800
    },
    3: {
        name: '1x Faction Air Craft',
        event: 'skill:RespawnAirCraft',
        requirement: 3600
    },
    4: {
        name: 'Gun Locker',
        event: 'skill:GunLocker',
        requirement: 1200,
        restriction: 1
    },
    5: {
        name: 'Gang Safehouse',
        event: 'skill:Warehouse',
        requirement: 1200,
        restriction: 0
    },
    6: {
        name: 'Warehouse',
        event: 'skill:Warehouse',
        requirement: 1200,
        restriction: 3
    },
    7: {
        name: 'Gang Safehouse Respawn',
        event: 'skill:GangRespawn',
        requirement: 3600,
        restriction: 0
    },
    8: {
        name: 'Faction Radio',
        event: '',
        requirement: 150
    },
    9: {
        name: 'Paycheck Bonus',
        event: 'skill:PaycheckBonus',
        requirement: 5000,
        restriction: 1
    },
    10: {
        name: 'Paycheck Bonus',
        event: 'skill:PaycheckBonus',
        requirement: 5000,
        restriction: 2
    }
};

let totalFactions = 0;
let totalPoliceFactions = 0;
let totalEMSFactions = 0;

db.fetchAllData('Factions', currentFactions => {
    if (!currentFactions) {
        return;
    }

    currentFactions.forEach(factionData => {
        new Faction(factionData);
        if (factionData.classification === classifications.POLICE) {
            totalPoliceFactions += 1;
        }

        if (factionData.classification === classifications.EMS) {
            totalEMSFactions += 1;
        }
    });

    alt.log(`Total Factions ${totalFactions}`);
    console.log(currentFactions);
});

alt.on('faction:Create', factionCreate);
alt.on('faction:Attach', factionAttach);
alt.onClient('faction:Rename', factionRename);
alt.onClient('faction:RankUp', factionRankUp);
alt.onClient('faction:RankDown', factionRankDown);
alt.onClient('faction:Kick', factionKick);
alt.onClient('faction:Disband', factionDisband);
alt.onClient('faction:AppendRank', factionAppendRank);
alt.onClient('faction:RemoveRank', factionRemoveRank);
alt.onClient('faction:SetFlags', factionSetFlags);
alt.onClient('faction:AddPoint', factionAddPoint);

export class Faction {
    constructor(factionData) {
        Object.keys(factionData).forEach(key => {
            this[key] = factionData[key];
        });
        factions.push(this);
        totalFactions += 1;
    }

    saveField(fieldName, fieldValue) {
        db.updatePartialData(
            this.id,
            {
                [fieldName]: fieldValue
            },
            'Factions',
            () => {}
        );
    }

    notifyAll(message) {
        const members = alt.Player.all.filter(member => {
            if (member.data && member.data.faction === this.id) {
                return member;
            }
        });

        if (members.length <= 0) {
            return;
        }

        members.forEach(member => {
            member.send(`[${this.name}] ${message}`);
        });
    }

    hasPermissions(id, permission) {
        const members = JSON.parse(this.members);
        const index = members.findIndex(member => {
            if (member.id === id) {
                return member;
            }
        });

        const member = members[index];
        if (!member) {
            return false;
        }

        const ranks = JSON.parse(this.ranks);
        const rank = ranks[member.rank];

        return isFlagged(rank.flags, permission);
    }

    isRankGreater(officer, target) {
        if (officer < target) {
            return true;
        }
        return false;
    }

    syncMembers() {
        const members = alt.Player.all.filter(member => {
            if (member.data && member.data.faction === this.id) {
                return member;
            }
        });

        if (members.length <= 0) {
            return;
        }

        const factionData = JSON.stringify(this);
        members.forEach(member => {
            member.emitMeta('faction:Info', factionData);
        });
    }

    getRank(id) {
        const members = JSON.parse(this.members);
        const index = members.findIndex(member => {
            if (member.id === id) {
                return member;
            }
        });
        return members[index];
    }

    setRank(id, rank) {
        const members = JSON.parse(this.members);
        const index = members.findIndex(member => {
            if (member.id === id) {
                return member;
            }
        });

        if (index <= -1) {
            return false;
        }

        members[index].rank = rank;
        this.members = JSON.stringify(members);
        return true;
    }

    rankUp(player, targetID) {
        const isOwner = this.id === player.id ? true : false;
        if (!isOwner) {
            if (!this.hasPermissions(player, permissions.PROMOTE)) {
                alt.log('You do not have permission to promote.');
                return;
            }

            const officerRank = this.getRank(player.data.id);
            const memberRank = this.getRank(targetID);

            if (!this.isRankGreater(officerRank, memberRank)) {
                alt.emitClient(
                    player,
                    'faction:Error',
                    'You are not a high enough rank.'
                );
                return;
            }
        }

        const newRank = memberRank - 1 <= -1 ? 0 : memberRank - 1;

        if (!this.setRank(targetID, newRank)) {
            alt.emitClient(player, 'faction:Error', 'Failed to set rank.');
        } else {
            alt.emitClient(player, 'faction:Success', 'Successfully set rank.');
        }
    }

    rankDown(player, targetID) {
        const isOwner = this.id === player.id ? true : false;

        if (!isOwner) {
            if (!this.hasPermissions(player, permissions.PROMOTE)) {
                alt.log('You do not have permission to promote.');
                return;
            }

            if (!this.isRankGreater(officerRank, memberRank)) {
                alt.emitClient(
                    player,
                    'faction:Error',
                    'You are not a high enough rank.'
                );
                return;
            }
        }

        const ranks = JSON.parse(this.ranks);
        const newRank = memberRank + 1 >= ranks.length ? ranks.length : memberRank + 1;
        if (!this.setRank(targetID, newRank)) {
            alt.emitClient(player, 'faction:Error', 'Failed to set rank.');
        } else {
            alt.emitClient(player, 'faction:Success', 'Successfully set rank.');
            this.saveField('members', this.members);
            this.syncMembers();
        }
    }

    appendRank(player, rankName) {
        if (player.data.id !== this.id) {
            alt.emitClient(player, 'faction:Error', 'Cannot append rank as non-owner.');
            return;
        }

        const ranks = JSON.parse(this.ranks);
        ranks.push(rankName);
        this.ranks = JSON.stringify(ranks);
        alt.emitClient(player, 'faction:Success', 'Successfully appended new rank.');
        this.saveField('ranks', this.ranks);
        this.saveField('members', this.members);
        this.syncMembers();
    }

    removeRank(player) {
        if (player.data.id !== this.id) {
            alt.emitClient(player, 'faction:Error', 'Cannot remove rank as non-owner.');
            return;
        }

        const ranks = JSON.parse(this.ranks);
        if (ranks.length - 1 <= 2) {
            alt.emitClient(
                player,
                'faction:Error',
                'Must have at least two ranks remaining at all times.'
            );
            return;
        }

        const oldEndRank = ranks.length - 1;
        const members = JSON.parse(this.members);

        members.forEach(member => {
            if (member.rank === oldEndRank) {
                member.rank -= 1;
            }
        });

        ranks.pop();
        this.members = JSON.stringify(members);
        this.ranks = JSON.stringify(ranks);
        alt.emitClient(player, 'faction:Success', 'Successfully removed a rank.');
        this.saveField('ranks', this.ranks);
        this.saveField('members', this.members);
        this.syncMembers();
    }

    setRankName(player, index, rankName) {
        if (player.data.id !== this.id) {
            alt.emitClient(player, 'faction:Error', 'Cannot set rank name as non-owner.');
            return;
        }

        const ranks = JSON.parse(this.ranks);
        ranks[index] = rankName;
        this.ranks = JSON.stringify(ranks);
        alt.emitClient(player, 'faction:Success', 'Successfully changed rank name.');
        this.saveField('ranks', this.ranks);
        this.syncMembers();
    }

    setFactionName(player, factionName) {
        if (player.data.id !== this.id) {
            alt.emitClient(
                player,
                'faction:Error',
                'Cannot change faction name as non-owner.'
            );
            return;
        }

        alt.emitClient(player, 'faction:Success', 'Successfully changed faction name.');
        this.name = factionName;
        this.saveField('name', this.name);
        this.syncMembers();
    }

    addTurf(id, colshape, nextClaim) {
        if (this.classification !== classifications.GANG) {
            return;
        }

        const currentTurfs = JSON.parse(this.turfs);
        if (currentTurfs.includes(id)) {
            colshape.gangs = {
                owner: this,
                nextClaim
            };

            return false;
        }

        currentTurfs.push(id);
        this.turfs = JSON.stringify(currentTurfs);
        db.updatePartialData(this.id, { turfs: this.turfs }, 'Factions', res => {
            console.log(`Turf ${id} was added to gang ${this.name}`);
        });

        colshape.gangs = {
            owner: this,
            nextClaim
        };
        colshape.sector.color = this.color;

        const currentPlayers = [...alt.Player.all];
        currentPlayers.forEach(player => {
            if (!player || !player.data) {
                return;
            }

            player.send(`Gang ${this.name} has claimed turf ${colshape.sector.name}.`);
            if (player.colshape && player.colshape === colshape) {
                alt.emit('entityEnterColshape', colshape, player);
            }
        });

        return true;
    }

    removeTurf(id) {
        const currentTurfs = JSON.parse(this.turfs);
        const index = currentTurfs.findIndex(currentID => currentID === id);
        if (index <= -1) {
            return false;
        }

        currentTurfs.splice(index, 1);
        this.turfs = JSON.stringify(currentTurfs);
        db.updatePartialData(this.id, { turfs: this.turfs }, 'Factions', res => {
            console.log(`Turf ${id} was removed from gang ${this.name}.`);
        });
        return true;
    }

    disband(player) {
        player.isDisbanding = true;
        if (player.data.id !== this.id) {
            player.notify('You do not own this faction.');
            player.isDisbanding = false;
            return false;
        }

        const index = factions.findIndex(
            faction => parseInt(faction.id) === parseInt(this.id)
        );
        if (index <= -1) {
            player.notify('Could not find this faction.');
            player.isDisbanding = false;
            return false;
        }

        const turfs = JSON.parse(this.turfs);
        turfs.forEach(turf => {
            colshapes[turf].gangs = {
                owner: -1
            };
            colshapes[turf].sector.color = 4;
        });
        factions.splice(index, 1);

        const targets = [...alt.Player.all].filter(
            target => target.data && parseInt(target.data.faction) === this.id
        );

        targets.forEach(target => {
            if (!target) {
                return;
            }

            target.data.gang = -1;
            target.saveField(target.data.id, 'faction', target.data.gang);
            target.emitMeta('faction:Id', target.data.id);
            target.emitMeta('faction:Info', null);
            target.send('Your faction has disbanded.');
            target.notify('Your faction has disbanded.');
        });

        db.deleteByIds(player.data.id, 'Factions', res => {
            player.emitMeta('readyForNewFaction', true);
            player.notify('The faction is now completely disbanded.');
            player.isDisbanding = false;
        });
        return true;
    }

    addMember(player, target) {
        const isOwner = this.id === player.id ? true : false;
        if (!isOwner) {
            if (!this.hasPermissions(player, permissions.RECRUIT)) {
                alt.emitClient(
                    player,
                    'faction:Error',
                    'You do not have permission to recruit.'
                );
                return;
            }
        }

        if (target.data.faction !== -1) {
            target.notify('You must first leave your faction.');
            return;
        }

        const members = JSON.parse(this.members);
        members.push({ id: target.data.id, name: target.data.name, rank: 0 });

        target.data.faction = this.id;
        player.saveField(target.data.id, 'faction', target.data.faction);
        this.members = JSON.stringify(members);
        this.saveField('members', this.members);
        this.syncMembers();
        this.notifyAll(
            `${player.data.name} has recruited ${target.data.name}. Give them a warm welcome!`
        );
        factionAttach(target);
    }

    kickMember(player, id) {
        const isOwner = this.id === player.id ? true : false;
        if (!isOwner) {
            if (!this.hasPermissions(player, permissions.KICK)) {
                alt.emitClient(
                    player,
                    'faction:Error',
                    'You do not have permission to kick.'
                );
                return;
            }
        }

        const members = JSON.parse(this.members);
        const index = members.findIndex(member => {
            if (member.id === id) {
                return member;
            }
        });

        if (index <= -1) {
            alt.emitClient(player, 'faction:Error', 'Member was not found.');
            return;
        }

        const memberData = { ...members[index] };
        members.splice(index, 1);

        this.members = JSON.stringify(members);
        this.saveField('members', this.members);
        this.syncMembers();
        this.notifyAll(`${player.data.name} has kicked ${memberData.name}.`);

        const target = alt.Player.all.find(p => {
            if (p && p.data && p.data.id === id) return p;
        });

        if (target) {
            target.notify('You have been kicked from the faction.');
        }
    }

    addActivity(player) {
        const members = JSON.parse(this.members);
        const index = members.findIndex(member => {
            if (member.id === player.data.id) {
                return member;
            }
        });

        if (index <= -1) {
            player.faction = null;
            player.emitMeta('faction:Id', -1);
            player.emitMeta('faction:Info', null);
            player.saveField(player.data.id, 'faction', -1);
            player.send('The faction you were in has kicked you.');
            return;
        }

        members[index].active = Date.now();
        this.members = JSON.stringify(members);
        this.saveField('members', this.members);
        this.syncMembers();
        this.notifyAll(`${members[index].name} is now available.`);
    }

    setFlags(player, rankIndex, flags) {
        const ranks = JSON.parse(this.ranks);
        if (!ranks[rankIndex]) {
            alt.emitClient(player, 'faction:Error', 'Faction rank was not found.');
            return;
        }

        ranks[rankIndex].flags = flags;
        this.ranks = JSON.stringify(ranks);
        this.saveField('ranks', this.ranks);
        this.syncMembers();
        alt.emitClient(player, 'faction:Success', 'Flags have been updated.');
    }

    updateSkills(player, id) {
        if (!factionSkills[id]) {
            alt.emitClient(player, 'faction:Error', 'That skill does not exist.');
            return false;
        }

        const skills = JSON.parse(this.skills);
        if (!skills[id]) {
            skills[id] = 0;
        }

        const max = factionSkills[id].requirement;
        if (skills[id] + 1 > max) {
            alt.emitClient(player, 'faction:Error', 'Skill is already maxed out.');
            return false;
        }

        skills[id] += 1;
        this.skills = JSON.stringify(skills);
        this.saveField('skills', this.skills);
        this.syncMembers();
    }

    addPoint(player, id) {
        if (player.rewardpoints <= 0) {
            alt.emitClient(
                player,
                'faction:Error',
                'You have no reward points available.'
            );
            return;
        }

        if (!this.updateSkills(id)) {
            return;
        }

        player.data.rewardpoints -= 1;
        player.saveField(player.data.id, 'rewardpoints', player.data.rewardpoints);
        alt.emitClient(player, 'faction:Success', 'Skill point was appended.');
        this.syncMembers();
    }
}

function factionAttach(player) {
    if (player.data.faction === -1) {
        player.faction = null;
        player.emitMeta('faction:Id', -1);
        player.emitMeta('faction:Info', null);
        return;
    }

    const index = factions.findIndex(faction => {
        if (faction.id === player.data.faction) {
            return faction;
        }
    });

    if (index <= -1) {
        player.emitMeta('faction:Id', -1);
        player.emitMeta('faction:Info', null);
        player.saveField(player.data.id, 'faction', -1);
        player.send('The faction you were in was either disbanded.');
        return;
    }

    player.faction = factions[index];
    player.faction.addActivity(player);
}

function factionCreate(player, type, factionName) {
    const isPoliceReady = totalPoliceFactions >= Config.maxPoliceFactions ? true : false;
    const isEmsReady = totalEMSFactions >= Config.maxEMSFactions ? true : false;

    if (player.data.faction !== -1) {
        alt.log('You already own or are in a faction.');
        return;
    }

    if (isNaN(type)) {
        alt.log('Invalid faction type.');
        return;
    }

    if (type === classifications.POLICE && !isPoliceReady) {
        player.notify('Too many police factions.');
        return;
    }

    if (type === classifications.EMS && !isEmsReady) {
        player.notify('Too many ems factions.');
        return;
    }

    const id = player.data.id;
    const name = factionName;
    const members = JSON.stringify([
        {
            id: player.data.id,
            name: player.data.name,
            rank: 0,
            active: Date.now()
        }
    ]);
    const ranks = JSON.stringify({ ...defaultRanks });
    const classification = type;

    let color = Math.floor(Math.random() * 84) + 1;
    if (color === 4) {
        color += 1;
    }

    const factionData = {
        id,
        name,
        members,
        ranks,
        classification
    };

    player.data.faction = player.data.id;
    db.upsertData(factionData, 'Factions', newFactionData => {
        new Faction(newFactionData);
        player.saveField(player.data.id, 'faction', player.data.id);
        player.emitMeta('faction:Id', player.data.id);
        player.emitMeta('faction:Info', JSON.stringify(newFactionData));
    });
}

function factionRename(player, factionName) {
    if (!player.faction) {
        return;
    }

    player.faction.setFactionName(player, factionName);
}

function factionRankUp(player, id) {
    if (!player.faction) {
        return;
    }

    player.faction.rankUp(player, id);
}

function factionRankDown(player, id) {
    if (!player.faction) {
        return;
    }

    player.faction.rankDown(player, id);
}

function factionKick(player, id) {
    if (!player.faction) {
        return;
    }

    player.faction.kick(player, id);
}

function factionDisband(player, id) {
    if (!player.faction) {
        return;
    }

    player.faction.disband(player);
}

function factionAppendRank(player, rankName) {
    if (!player.faction) {
        return;
    }

    player.faction.appendRank(player, rankName);
}

function factionRemoveRank(player) {
    if (!player.faction) {
        return;
    }

    player.faction.removeRank(player);
}

function factionSetFlags(player, id, flags) {
    if (!player.faction) {
        return;
    }

    player.faction.setFlags(player, id, flags);
}

function factionAddPoint(player, category) {
    if (!player.faction) {
        return;
    }

    player.faction.addPoint(player, category);
}
