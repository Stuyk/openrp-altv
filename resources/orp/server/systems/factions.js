import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.js';
import { colshapes } from './grid.js';
import { Config } from '../configuration/config.js';
import { isFlagged } from '../utility/flags.js';

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

    if (currentFactions.length <= 0) {
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

        totalFactions += 1;
    });

    alt.log(`Total Factions ${totalFactions}`);
});

alt.on('faction:Attach', factionAttach);
alt.on('faction:AcceptMember', factionAcceptMember);
alt.onClient('faction:Create', factionCreate);
alt.onClient('faction:RankUp', factionRankUp);
alt.onClient('faction:RankDown', factionRankDown);
alt.onClient('faction:Kick', factionKick);
alt.onClient('faction:Disband', factionDisband);
alt.onClient('faction:AppendRank', factionAppendRank);
alt.onClient('faction:RemoveRank', factionRemoveRank);
alt.onClient('faction:SetFlags', factionSetFlags);
alt.onClient('faction:AddPoint', factionAddPoint);
alt.onClient('faction:SetInfo', factionSetInfo);
alt.onClient('faction:SaveRank', factionSaveRank);
alt.onClient('faction:InviteMember', factionInviteMember);
alt.onClient('faction:SetHome', factionSetHome);

export class Faction {
    constructor(factionData) {
        Object.keys(factionData).forEach(key => {
            this[key] = factionData[key];
        });

        const turfs = JSON.parse(this.turfs);
        turfs.forEach(turf => {
            if (!colshapes[turf]) return;
            colshapes[turf].factions = {
                owner: this,
                nextClaim: Date.now() + 30000
            };
            colshapes[turf].sector.color = this.color;
        });

        if (factionData.classification === classifications.POLICE) {
            totalPoliceFactions += 1;
        }

        if (factionData.classification === classifications.EMS) {
            totalEMSFactions += 1;
        }

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
            member.emitMeta('faction:Id', this.id);
            member.emitMeta('faction:Info', factionData);
        });
    }

    syncMember(player) {
        player.emitMeta('faction:Id', this.id);
        player.emitMeta('faction:Info', JSON.stringify(this));
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
        const isOwner = this.id === player.data.id;
        const member = this.getRank(targetID);
        const memberRank = member.rank;

        if (memberRank === undefined) {
            alt.emitClient(player, 'faction:Error', 'Failed to find member.');
            return;
        }

        if (!isOwner) {
            if (!this.hasPermissions(player, permissions.PROMOTE)) {
                alt.log('You do not have permission to promote.');
                return;
            }

            const officerRank = this.getRank(player.data.id);

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
            this.syncMember(player);
        } else {
            alt.emitClient(player, 'faction:Success', 'Successfully set rank.');
            this.saveField('members', this.members);
            this.syncMembers();
        }
    }

    rankDown(player, targetID) {
        const isOwner = this.id === player.data.id;
        const member = this.getRank(targetID);
        const memberRank = member.rank;

        if (memberRank === undefined) {
            alt.emitClient(player, 'faction:Error', 'Failed to find member.');
            return;
        }

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
                this.syncMember(player);
                return;
            }
        }

        const ranks = JSON.parse(this.ranks);
        const newRank =
            memberRank + 1 >= ranks.length ? ranks.length - 1 : memberRank + 1;
        if (!this.setRank(targetID, newRank)) {
            alt.emitClient(player, 'faction:Error', 'Failed to set rank.');
            this.syncMember(player);
        } else {
            alt.emitClient(player, 'faction:Success', 'Successfully set rank.');
            this.saveField('members', this.members);
            this.syncMembers();
        }
    }

    appendRank(player, rankName) {
        if (player.data.id !== this.id) {
            alt.emitClient(player, 'faction:Error', 'Cannot append rank as non-owner.');
            this.syncMember(player);
            return;
        }

        const ranks = JSON.parse(this.ranks);
        const index = ranks.findIndex(rank => {
            if (rank.name.toLowerCase() === rankName.toLowerCase()) {
                return rank;
            }
        });

        if (index !== -1) {
            alt.emitClient(player, 'faction:Error', 'Rank name is already taken.');
            this.syncMember(player);
            return;
        }

        ranks.push({ name: rankName, flags: 0 });
        this.ranks = JSON.stringify(ranks);
        alt.emitClient(player, 'faction:Success', 'Successfully appended new rank.');
        this.saveField('ranks', this.ranks);
        this.saveField('members', this.members);
        this.syncMembers();
    }

    removeRank(player, index) {
        if (player.data.id !== this.id) {
            alt.emitClient(player, 'faction:Error', 'Cannot remove rank as non-owner.');
            this.syncMember(player);
            return;
        }

        const ranks = JSON.parse(this.ranks);
        if (ranks.length - 1 < 2) {
            alt.emitClient(
                player,
                'faction:Error',
                'Must have at least two ranks remaining at all times.'
            );
            this.syncMember(player);
            return;
        }

        index = parseInt(index);
        if (index <= -1) {
            alt.emitClient(player, 'faction:Error', 'Rank was not found.');
            this.syncMember(player);
            return;
        }

        if (!ranks[index]) {
            alt.emitClient(player, 'faction:Error', 'Rank was not found.');
            this.syncMember(player);
            return;
        }

        const oldEndRankIndex = ranks.length - 1;
        ranks.splice(index, 1);

        if (oldEndRankIndex === index) {
            const members = JSON.parse(this.members);
            members.forEach(member => {
                if (member.rank === index) {
                    member.rank -= 1;
                }
            });

            this.members = JSON.stringify(members);
            this.saveField('members', this.members);
        }

        this.ranks = JSON.stringify(ranks);
        alt.emitClient(player, 'faction:Success', 'Successfully removed a rank.');
        this.saveField('ranks', this.ranks);
        this.syncMembers();
    }

    setRankName(player, index, rankName) {
        if (player.data.id !== this.id) {
            alt.emitClient(player, 'faction:Error', 'Cannot set rank name as non-owner.');
            return;
        }

        const ranks = JSON.parse(this.ranks);
        ranks[index].name = rankName;
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
            colshape.factions = {
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

        colshape.factions = {
            owner: this,
            nextClaim
        };
        colshape.sector.color = this.color;

        const currentPlayers = [...alt.Player.all];
        currentPlayers.forEach(player => {
            if (!player || !player.data) {
                return;
            }

            player.send(`Faction ${this.name} has claimed turf ${colshape.sector.name}.`);
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

            target.data.faction = -1;
            target.saveField(target.data.id, 'faction', target.data.faction);
            target.emitMeta('faction:Id', -1);
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
        const isOwner = this.id === player.data.id;
        if (!isOwner) {
            if (!this.hasPermissions(player, permissions.RECRUIT)) {
                alt.emitClient(
                    player,
                    'faction:Error',
                    'You do not have permission to recruit.'
                );
                return false;
            }
        }

        if (target.data.faction !== -1) {
            target.notify('You must first leave your faction.');
            return false;
        }

        const ranks = JSON.parse(this.ranks);
        const lowestRank = ranks.length - 1;
        const members = JSON.parse(this.members);
        members.push({ id: target.data.id, name: target.data.name, rank: lowestRank });

        target.data.faction = this.id;
        player.saveField(target.data.id, 'faction', target.data.faction);
        this.members = JSON.stringify(members);
        this.saveField('members', this.members);
        this.syncMembers();
        this.notifyAll(
            `${player.data.name} has recruited ${target.data.name}. Give them a warm welcome!`
        );
        factionAttach(target);
        return true;
    }

    kickMember(player, id) {
        if (player.data.id === id) {
            alt.emitClient(player, 'faction:Error', 'Cannot kick self.');
            return;
        }

        const isOwner = this.id === player.data.id;
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
            target.data.faction = -1;
            target.saveField(target.data.id, 'faction', target.data.faction);
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

    setFactionNotice(player, notice) {
        const isOwner = this.id === player.data.id;

        if (!isOwner) {
            alt.log('Is not faction owner.');
            alt.emitClient(
                player,
                'faction:Error',
                'You do not have permission to update the notice board.'
            );
            return;
        }

        this.notice = notice;
        this.saveField('notice', notice);
        this.syncMembers();
    }

    setHome(player) {
        const isOwner = this.id === player.data.id;

        if (!isOwner) {
            alt.log('Is not faction owner.');
            alt.emitClient(
                player,
                'faction:Error',
                'You do not have permission to update the home location.'
            );
            return;
        }

        this.home = JSON.stringify(player.pos);
        this.saveField('home', this.home);
        alt.emitClient(player, 'faction:Success', 'Home location was updated.');
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
    alt.log('Creating Faction...');

    const isPoliceSlotsExceeded = totalPoliceFactions >= Config.maxPoliceFactions;
    const isEMSSlotsExceeded = totalEMSFactions >= Config.maxEMSFactions;

    if (player.data.faction !== -1) {
        alt.log('You already own or are in a faction.');
        return;
    }

    if (isNaN(type)) {
        alt.log('Invalid faction type.');
        return;
    }

    if (type === classifications.POLICE && isPoliceSlotsExceeded) {
        player.notify('Too many police factions.');
        alt.log('Too Many Police Factions');
        return;
    }

    if (type === classifications.EMS && isEMSSlotsExceeded) {
        player.notify('Too many ems factions.');
        alt.log('Too Many EMS Factions');
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
    const ranks = JSON.stringify(defaultRanks);
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

    alt.log('Saving created faction.');

    player.data.faction = player.data.id;
    db.upsertData(factionData, 'Factions', newFactionData => {
        const parsedFactionData = new Faction(newFactionData);
        player.saveField(player.data.id, 'faction', player.data.id);
        player.emitMeta('faction:Id', player.data.id);
        player.emitMeta('faction:Info', JSON.stringify(parsedFactionData));
        player.faction = parsedFactionData;
        alt.log('Faction ready.');
    });
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

    player.faction.kickMember(player, id);
}

function factionDisband(player) {
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

function factionRemoveRank(player, index) {
    if (!player.faction) {
        return;
    }

    player.faction.removeRank(player, index);
}

function factionSetFlags(player, index, flags) {
    if (!player.faction) {
        return;
    }

    player.faction.setFlags(player, index, flags);
}

function factionAddPoint(player, category) {
    if (!player.faction) {
        return;
    }

    player.faction.addPoint(player, category);
}

function factionSetInfo(player, infoName, info) {
    if (!player.faction) {
        return;
    }

    if (infoName === 'name') {
        player.faction.setFactionName(player, info);
        return;
    }

    if (infoName === 'notice') {
        player.faction.setFactionNotice(player, info);
        return;
    }
}

function factionSaveRank(player, index, rankName) {
    if (!player.faction) {
        return;
    }

    player.faction.setRankName(player, index, rankName);
}

function setTurfToNeutral(id) {
    id = parseInt(id);
    if (colshapes[id]) {
        colshapes[id].factions = {
            owner: {
                id: -2
            }
        };
        colshapes[id].sector.color = 4;
    }

    const foundFaction = factions.find(faction => {
        if (faction && faction.turfs) {
            const turfs = JSON.parse(faction.turfs);
            if (turfs.includes(id)) {
                return faction;
            }
        }
    });

    if (!foundFaction) return;
    foundFaction.removeTurf(id);
}

function factionInviteMember(player, data) {
    const target = data.player;
    if (!target) {
        player.notify('That user was not found.');
        return;
    }

    if (target.data.faction !== -1) {
        player.notify('That user is already in a faction.');
        return;
    }

    target.factionInvite = {
        inviter: player,
        expiration: Date.now() + 60000 * 2
    };

    player.send(`You have invited ${target.data.name}.`);
    target.send(
        `You were invited to {FFFF00} ${player.faction.name}. {FFFFFF}Type /acceptfaction to join.`
    );
}

function factionAcceptMember(player) {
    if (!player.factionInvite) {
        player.notify('You do not have a faction invite.');
        return;
    }

    if (Date.now() > player.factionInvite.expiration) {
        player.factionInvite = undefined;
        player.notify('The invite has expired.');
        return;
    }

    if (!player.factionInvite.inviter) {
        player.factionInvite = undefined;
        player.notify('The invite has expired.');
        return;
    }

    const faction = player.factionInvite.inviter.faction;

    if (!faction) {
        player.factionInvite = undefined;
        player.notify('The invite has expired.');
        return;
    }

    const joined = faction.addMember(player.factionInvite.inviter, player);
    if (!joined) {
        player.notify('Failed to join faction.');
        player.factionInvite.inviter.notify(
            `${player.data.name} failed to join the faction.`
        );
        return;
    }

    player.notify('Accepted invite.');
    player.factionInvite = undefined;
}

function factionSetHome(player) {
    if (!player.faction) {
        return;
    }

    player.faction.setHome(player);
}

alt.on('parse:Turfs', () => {
    const currentPlayers = [...alt.Player.all];
    const players = currentPlayers.filter(
        player =>
            player && // is player
            player.data && // has data
            player.data.faction !== -1 && // is in a faction
            !player.data.dead && // is not dead
            player.dimension === 0 // is in dimension 0
    );

    if (players.length <= 0) {
        return;
    }

    colshapes.forEach((shape, turfID) => {
        if (Date.now() < shape.factions.nextClaim) {
            return;
        }

        const filteredPlayers = players.filter(player => player.colshape === shape);
        const nextTime =
            Date.now() +
            shape.sector.seed.getNumber(Config.turfHighestWaitTime) * 60000 +
            60000 * 10;

        if (filteredPlayers.length <= 0) {
            shape.factions.nextClaim = nextTime;
            return;
        }

        const turfMembers = {};
        filteredPlayers.forEach(player => {
            if (!player.faction) {
                return;
            }

            if (player.faction.classification === classifications.EMS) {
                return;
            }

            if (player.faction.classification === classifications.BUSINESS) {
                return;
            }

            if (!turfMembers[player.data.faction]) {
                turfMembers[player.data.faction] = 1;
            } else {
                turfMembers[player.data.faction] += 1;
            }
        });

        if (filteredPlayers.length <= 0) {
            shape.factions.nextClaim = nextTime;
            return;
        }

        let selectedFaction;
        Object.keys(turfMembers).forEach(key => {
            if (!selectedFaction) {
                selectedFaction = key;
                return;
            }

            if (turfMembers[key] > turfMembers[selectedFaction]) {
                selectedFaction = key;
            }
        });

        const factionIndex = factions.findIndex(
            faction => faction.id === parseInt(selectedFaction)
        );

        if (factionIndex === -1) {
            return;
        }

        const faction = factions[factionIndex];

        if (!faction) {
            shape.factions.nextClaim = nextTime;
            return;
        }

        const isPoliceFaction = faction.classification === classifications.POLICE;
        const isCurrentOwner = shape.factions.owner.id === faction.id;

        if (isPoliceFaction && shape.factions.owner.id === -2) {
            shape.factions.nextClaim = nextTime;
            return;
        }

        if (isCurrentOwner) {
            shape.factions.nextClaim = nextTime;
            return;
        }

        alt.emit('grid:AddTurf', faction.id, turfID, nextTime);
    });
});

alt.on('grid:AddTurf', (id, turfID, nextClaimTime) => {
    const index = factions.findIndex(factionData => factionData.id === id);
    const faction = factions[index];

    if (!faction) {
        return;
    }

    turfID = parseInt(turfID);
    if (!colshapes[turfID]) {
        return;
    }

    setTurfToNeutral(turfID);
    if (faction.classification === classifications.POLICE) {
        const currentPlayers = [...alt.Player.all];
        currentPlayers.forEach(player => {
            player.send(
                `Faction ${faction.name} has neutralized turf ${colshapes[turfID].sector.name}.`
            );

            if (player.colshape && player.colshape === colshapes[turfID]) {
                alt.emit('entityEnterColshape', colshapes[turfID], player);
            }
        });
        return;
    }

    faction.addTurf(turfID, colshapes[turfID], nextClaimTime);
});

alt.onClient('gangs:CheckCraftDialogue', (player, type) => {
    if (!doesUserHaveTurfAccess(player)) {
        player.notify('You must own this turf to access this crafting point.');
        return;
    }

    alt.emitClient(player, 'gangs:ShowCraftingDialogue', type);
});

export function doesUserHaveTurfAccess(player) {
    if (player.data.faction === -1) {
        player.notify('You must be in a gang to access this point.');
        return false;
    }

    const currentTurf = player.colshape;
    if (!currentTurf) {
        player.notify('You are not in a turf.');
        return false;
    }

    if (currentTurf.factions.owner === -1) {
        player.notify('Nobody currently owns this turf.');
        return false;
    }

    if (currentTurf.factions.owner.id !== player.data.faction) {
        player.notify('You do not own this turf.');
        return false;
    }

    return true;
}
