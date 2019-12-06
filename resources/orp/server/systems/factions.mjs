import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { colshapes } from './grid.mjs';
import { Config } from '../configuration/config.mjs';
import { isFlagged } from '../utility/flags.mjs';

const factions = [];
const db = new SQL();
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

const defaultRanks = ['Owner', 'Recruit'];

let totalFactions = 0;
let totalPoliceFactions = 0;
let totalEMSFactions = 0;

db.fetchAllData('Factions', currentFactions => {
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

        return isFlagged(member.flags, permission);
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
            player.emitMeta('readyForNewGang', true);
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

        const members = JSON.parse(this.members);
        members.push({ id: target.data.id, name: target.data.name, rank: 0 });
        this.members = JSON.stringify(members);
        this.saveField('members', this.members);
        this.syncMembers();
        this.notifyAll(
            `${player.data.name} has recruited ${target.data.name}. Give them a warm welcome!`
        );
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
}

alt.on('faction:Create', factionCreate);
alt.on('faction:Attach', factionAttach);

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
            flags: permissions.MAX,
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
