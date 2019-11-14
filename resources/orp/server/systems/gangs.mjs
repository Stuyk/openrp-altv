import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';
import { colshapes } from './grid.mjs';
import { Config } from '../configuration/config.mjs';

const gangs = [];
const db = new SQL();
db.fetchAllData('Gangs', currentGangs => {
    if (!currentGangs) {
        alt.log(`No gangs were loaded.`);
        return;
    }

    currentGangs.forEach(gang => {
        setupGangData(gang);
        console.log(gang);
    });

    alt.log(`Loaded ${currentGangs.length} Gangs`);
});

export class Gang {
    constructor(id) {
        this.id = id;
        this.creation = '';
        this.name = '';
        this.members = '';
        this.ranks = '';
        this.turfs = '';
        gangs.push(this);
    }

    addPlayer(player) {
        if (player.data.gang !== -1) {
            return false;
        }

        if (player.data.gang === this.id) {
            return false;
        }

        player.data.gang = this.id;
        player.saveField(player.data.id, 'gang', this.id);
        player.syncGang();
        this.addMember(player.data.id, player.data.name);
        return true;
    }

    addMember(id, name) {
        const members = JSON.parse(this.members);
        members.push({ id, name, rank: 0 });
        this.members = JSON.stringify(members);
        this.saveGang();
        return true;
    }

    removePlayer(player) {
        if (player.data.gang !== this.id) {
            return false;
        }

        player.data.gang = -1;
        player.saveField(player.data.id, 'gang', player.data.gang);
        player.syncGang();
        this.removeMember(player, player.data.id);
    }

    removeMember(player, id) {
        const members = JSON.parse(this.members);
        const memberIndex = members.findIndex(member => member.id === id);
        if (memberIndex <= -1) {
            player.notify('Member does not exist.');
            return;
        }

        if (player.data.id !== id) {
            const officer = members.find(gangMember => gangMember.id === player.data.id);
            if (!officer) {
                player.notify('You are not in this gang.');
                return;
            }

            if (members[memberIndex].rank >= officer.rank) {
                player.notify(
                    'You cannot kick a member who is greater or equal to your rank.'
                );
                return;
            }

            player.notify('Member was kicked.');
        } else {
            player.notify('You have left the gang.');
        }

        members.splice(memberIndex, 1);
        this.members = JSON.stringify(members);
        this.saveGang();
        return true;
    }

    setGangName(player, name) {
        if (player.data.gang !== this.id) {
            player.notify('Incorrect gang update.');
            return;
        }

        if (player.data.id !== this.id) {
            player.notify('You must own the gang to change the name.');
            return;
        }

        this.name = name;
        this.saveGang(false);
        player.notify('Gang name was changed successfully.');
    }

    changeOwnership(player, id) {
        if (player.data.gang !== this.id) {
            player.notify('Incorrect gang update.');
            return;
        }

        if (player.data.id !== this.id) {
            player.notify('You must own the gang to change ownership.');
            return;
        }

        const members = JSON.parse(this.members);
        const index = members.findIndex(member => member.id === id);
        if (index <= -1) {
            player.notify('New owner must be in gang.');
            return;
        }

        this.id = id;
        this.saveGang(true);
        player.notify('Ownership was changed successfully.');
    }

    rankUp(player, id) {
        if (player.data.id === id) {
            player.notify('Cannot modify self.');
            return;
        }

        const members = JSON.parse(this.members);
        const memberIndex = members.findIndex(gangMember => gangMember.id === id);
        if (!members[memberIndex]) {
            player.notify('Member is not in gang.');
            return;
        }

        const officer = members.find(gangMember => gangMember.id === player.data.id);
        if (!officer) {
            player.notify('You are not in this gang.');
            return;
        }

        if (officer.rank <= 1) {
            player.notify('You are not a high enough rank to change rankings.');
            return;
        }

        if (members[memberIndex].rank >= officer.rank) {
            player.notify('You cannot change the rank of a higher member.');
            return;
        }

        const ranks = JSON.parse(this.ranks);
        members[memberIndex].rank += 1;
        if (members[memberIndex].rank > ranks.length - 1) {
            members[memberIndex].rank = ranks.length - 1;
        }

        player.notify('Members rank was increased.');
        this.members = JSON.stringify(members);
        this.saveGang();
    }

    rankDown(player, id) {
        if (player.data.id === id) {
            player.notify('Cannot modify self.');
            return;
        }

        const members = JSON.parse(this.members);
        const memberIndex = members.findIndex(gangMember => gangMember.id === id);
        if (!members[memberIndex]) {
            player.notify('Member is not in gang.');
            return;
        }

        const officer = members.find(gangMember => gangMember.id === player.data.id);
        if (!officer) {
            player.notify('You are not in this gang.');
            return;
        }

        if (officer.rank <= 1) {
            player.notify('You are not a high enough rank to change rankings.');
            return;
        }

        if (player.data.id !== this.id) {
            if (members[memberIndex].rank >= officer.rank) {
                player.notify('You cannot change the rank of a higher / equal member.');
                return;
            }
        }

        members[memberIndex].rank -= 1;
        if (members[memberIndex].rank < 0) {
            members[memberIndex].rank = 0;
        }

        player.notify('Members rank was decreased.');
        this.members = JSON.stringify(members);
        this.saveGang();
    }

    setRankName(player, index, name) {
        const members = JSON.parse(this.members);
        const memberIndex = members.findIndex(member => member.id === player.data.id);
        if (memberIndex <= -1) {
            player.notify('New owner must be in gang.');
            return;
        }

        if (members[memberIndex].rank <= 1) {
            player.notify('You are not a high enough rank to modify that setting.');
            return;
        }

        if (index < 0 || index >= 4) {
            player.notify('That rank does not exist.');
            return;
        }

        let ranks = JSON.parse(this.ranks);
        ranks[index] = name;
        this.ranks = JSON.stringify(ranks);
        this.saveGang();
        player.notify('Rank Name was modified successfully.');
    }

    disband(player) {
        player.isDisbandingGang = true;
        if (player.data.id !== this.id) {
            player.notify('You do not own this gang.');
            player.isDisbandingGang = false;
            return false;
        }

        const index = gangs.findIndex(gang => parseInt(gang.id) === parseInt(this.id));
        if (index <= -1) {
            player.notify('Could not find the gang.');
            player.isDisbandingGang = false;
            return false;
        }

        const turfs = JSON.parse(this.turfs);
        turfs.forEach(turf => {
            colshapes[turf].gangs = {
                owner: -1
            };
            colshapes[turf].sector.color = 4;
        });

        gangs.splice(index, 1);

        const targets = [...alt.Player.all].filter(
            target => target.data && parseInt(target.data.gang) === this.id
        );

        targets.forEach(target => {
            target.data.gang = -1;
            target.saveField(target.data.id, 'gang', target.data.gang);
            target.syncGang();
            target.send('Your gang was disbanded.');
            target.notify('Your gang was disbanded.');
        });

        db.deleteByIds(player.data.id, 'Gangs', res => {
            player.emitMeta('readyForNewGang', true);
            player.notify('The gang has now been deleted.');
            player.isDisbandingGang = false;
        });
        return true;
    }

    saveGang(isIdUpdate = false) {
        db.updatePartialData(
            this.id,
            {
                name: this.name,
                members: this.members,
                ranks: this.ranks
            },
            'Gangs',
            () => {}
        );

        const players = [...alt.Player.all];
        const gangMembers = players.filter(
            player => player.data && player.data.gang === this.id
        );

        gangMembers.forEach(member => {
            if (isIdUpdate) {
                member.data.gang = this.id;
                member.emitMeta('gang:ID', this.id);
                member.saveGangID();
            }
            member.emitMeta('gang:Info', JSON.stringify(this));
        });
    }

    removeTurf(id) {
        let currentTurfs = JSON.parse(this.turfs);
        let index = currentTurfs.findIndex(currentID => currentID === id);
        if (index <= -1) {
            return false;
        }

        currentTurfs.splice(index, 1);
        this.turfs = JSON.stringify(currentTurfs);
        db.updatePartialData(this.id, { turfs: this.turfs }, 'Gangs', res => {
            console.log(`Turf ${id} was added to gang ${this.id}`);
        });
        return true;
    }

    addTurf(id, colshape, nextClaim) {
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
        db.updatePartialData(this.id, { turfs: this.turfs }, 'Gangs', res => {
            console.log(`Turf ${id} was added to gang ${this.id}`);
        });

        colshape.gangs = {
            owner: this,
            nextClaim
        };
        colshape.sector.color = this.color;

        alt.Player.all.forEach(player => {
            if (!player.data) return;

            player.send(`Gang ${this.name} has claimed turf ${colshape.sector.name}.`);

            if (player.colshape && player.colshape === colshape) {
                alt.emit('entityEnterColshape', colshape, player);
            }
        });

        return true;
    }
}

function setupGangData(gang) {
    const gangData = new Gang(gang.id);
    Object.keys(gang).forEach(key => {
        gangData[key] = gang[key];
    });
    gangs.push(gangData);

    const turfs = JSON.parse(gangData.turfs);
    turfs.forEach(turf => {
        if (!colshapes[turf]) return;
        colshapes[turf].gangs = {
            owner: gangData,
            nextClaim: Date.now()
        };
        colshapes[turf].sector.color = gangData.color;
    });
}

/**
 * Get a gang by the player.
 * @param player
 */
export function getGang(player) {
    return gangs.find(gang => gang && parseInt(gang.id) === parseInt(player.data.gang));
}

export function fetchTurfSectors(player) {
    const gang = getGang(player);
    if (!gang) return [];
    if (!gang.turfs) return [];
    const turfs = JSON.parse(gang.turfs);
    const sectors = [];
    turfs.forEach(turf => {
        if (player.colshape && player.colshape === colshapes[turf]) return;
        sectors.push(colshapes[turf].sector);
    });
    return sectors;
}

/**
 * Create a New Gang
 * @param player
 * @param gangName
 */
export function createGang(player, gangName) {
    if (player.isDisbandingGang) {
        player.notify('Please wait until gang is doing being disbanded.');
        return;
    }

    if (player.data.gang !== -1) {
        player.notify('You are already in a gang.');
        return;
    }

    let color = Math.floor(Math.random() * 84) + 1;
    if (color === 4) {
        color += 1;
    }

    const members = [
        {
            id: player.data.id,
            rank: 3,
            name: player.data.name
        }
    ];
    const ranks = ['Youngens', 'Street Soldiers', 'High Council', 'Shotcaller'];
    const newGang = {
        id: player.data.id,
        creation: Date.now(),
        name: gangName,
        members: JSON.stringify(members),
        ranks: JSON.stringify(ranks),
        color
    };

    player.data.gang = player.data.id;
    db.upsertData(newGang, 'Gangs', newGangData => {
        setupGangData(newGangData);
        player.saveField(player.data.id, 'gang', player.data.id);
        player.notify('Gang Created');
        player.emitMeta('gang:ID', player.data.id);
        player.emitMeta('gang:Info', JSON.stringify(newGang));
    });
}

/**
 * Remove a turf from a gang; set it to nobody.
 * @param id
 */
export function setTurfToNeutral(id) {
    id = parseInt(id);
    if (colshapes[id]) {
        colshapes[id].gangs = {
            owner: -1
        };
        colshapes[id].sector.color = 4;
    }

    const foundGang = gangs.find(gang => {
        if (gang && gang.turfs) {
            const turfs = JSON.parse(gang.turfs);
            if (turfs.includes(id)) {
                return gang;
            }
        }
    });

    if (!foundGang) return;
    foundGang.removeTurf(id);
}

alt.on('grid:AddTurf', (id, turfID, nextClaimTime) => {
    id = parseInt(id);
    turfID = parseInt(turfID);
    if (!colshapes[turfID]) return;

    const foundGang = gangs.find(gang => gang.id === id);
    if (!foundGang) {
        return;
    }

    const turfs = JSON.parse(foundGang.turfs);
    if (!turfs.includes(turfID)) {
        setTurfToNeutral(turfID);
    }

    foundGang.addTurf(turfID, colshapes[turfID], nextClaimTime);
});

alt.on('parse:Turfs', () => {
    const currentPlayers = [...alt.Player.all];
    const players = currentPlayers.filter(
        player =>
            player && // is player
            player.data && // has data
            player.data.gang !== -1 && // is in a gang
            !player.data.dead && // is not dead
            player.dimension === 0 // is in dimension 0
    );

    colshapes.forEach((shape, turfID) => {
        if (Date.now() < shape.gangs.nextClaim) {
            return;
        }

        const filteredPlayers = players.filter(player => player.colshape === shape);
        const nextTime =
            Date.now() +
            shape.sector.seed.getNumber(Config.turfHighestWaitTime) * 60000 +
            60000 * 10;

        console.log(`Turf ${shape.sector.name} has initiated claim.`);
        console.log(`Claim In: ${(nextTime - Date.now()) / 1000 / 60} Minutes`);

        if (filteredPlayers.length <= 0) {
            shape.gangs.nextClaim = nextTime;
            return;
        }

        const turfMembers = {};
        filteredPlayers.forEach(player => {
            if (!turfMembers[player.data.gang]) {
                turfMembers[player.data.gang] = 1;
            } else {
                turfMembers[player.data.gang] += 1;
            }
        });

        let selectedGang;
        Object.keys(turfMembers).forEach(key => {
            if (!selectedGang) {
                selectedGang = key;
                return;
            }

            if (turfMembers[key] > turfMembers[selectedGang]) {
                selectedGang = key;
            }
        });

        if (parseInt(shape.gangs.owner) === parseInt(selectedGang)) {
            shape.gangs.nextClaim = nextTime;
            return;
        }

        alt.emit('grid:AddTurf', selectedGang, turfID, nextTime);
    });
});

// Panel Events
alt.onClient('gang:ChangeGangName', (player, name) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    gang.setGangName(player, name);
});

alt.onClient('gang:ChangeRankName', (player, index, name) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    gang.setRankName(player, index, name);
});

alt.onClient('gang:ChangeOwnership', (player, memberID) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    gang.changeOwnership(player, memberID);
});

alt.onClient('gang:RankUp', (player, memberID) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    gang.rankUp(player, memberID);
});

alt.onClient('gang:RankDown', (player, memberID) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    gang.rankDown(player, memberID);
});

alt.onClient('gang:Remove', (player, memberID) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    gang.removeMember(player, memberID);
});

alt.onClient('gang:InviteMember', (player, data) => {
    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not in a gang.');
        return;
    }

    const target = data.player;
    if (!target) {
        player.notify('That user does not seem to exist.');
        return;
    }

    if (target.data.gang !== -1) {
        player.notify('That user is already in a gang.');
        return;
    }

    target.gangInvite = {
        inviter: player,
        expiration: Date.now() + 60000 * 2
    };

    target.send(`You were invited to {FFFF00}${gang.name}. Type /acceptgang to join.`);
    target.notify(`You were invited to ${gang.name}. Type /acceptgang to join.`);
});

alt.on('gang:AcceptInvite', player => {
    if (!player.gangInvite) {
        player.notify('You do not have a gang invite.');
        return;
    }

    if (Date.now() > player.gangInvite.expiration) {
        player.notify('The invite has expired.');
        return;
    }

    if (!player.gangInvite.inviter) {
        player.notify('The invite has expired.');
        return;
    }

    const gang = getGang(player.gangInvite.inviter);

    if (gang.addPlayer(player)) {
        player.send('You have accepted the invite.');
        player.notify('You have accepted the invite.');
    } else {
        player.notify('Invite failed.');
    }

    player.gangInvite = undefined;
});

alt.onClient('gang:LeaveAsMember', (player, memberID) => {
    if (player.data.id !== memberID) return;

    const gang = getGang(player);
    if (!gang) {
        player.notify('You are not apart of a gang.');
        return;
    }

    gang.removePlayer(player);
});

alt.onClient('gang:Create', (player, name) => {
    if (player.data.gang !== -1) return;
    createGang(player, name);
});

alt.onClient('gang:Disband', player => {
    const gang = getGang(player);
    if (!gang) {
        player.syncGang();
        player.notify('Could not disband at this time; try again.');
        return;
    }

    if (player.data.id !== gang.id) {
        player.notify('This is not your gang.');
        return;
    }

    gang.disband(player);
});

alt.onClient('gangs:CheckCraftDialogue', (player, type) => {
    if (player.data.gang === -1) {
        player.notify('You must be in a gang to access this point.');
        return;
    }

    const currentTurf = player.colshape;
    if (!currentTurf) {
        player.notify('You are not in a turf.');
        return;
    }

    if (currentTurf.gangs.owner === -1) {
        player.notify('Nobody currently owns this turf.');
        return;
    }

    if (currentTurf.gangs.owner.id !== player.data.gang) {
        player.notify('This is not your crafting point.');
        return;
    }

    alt.emitClient(player, 'gangs:ShowCraftingDialogue', type);
});
