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
        if (player.data.gang === -1) {
            return false;
        }

        if (player.data.gang === this.id) {
            return false;
        }

        player.data.gang = this.id;
        player.saveField(player.data.id, 'gang', this.id);
        this.addMember(player.data.id, player.data.name);

        return true;
    }

    removePlayer(player) {
        if (player.data.gang !== this.id) {
            return false;
        }

        player.data.gang = -1;
        player.saveField(player.data.id, 'gang', player.data.gang);
        this.removeMember(player.data.id);
    }

    addMember(id, name) {
        const members = JSON.parse(this.members);
        members.push({ id, name, rank: 0 });
        this.members = JSON.stringify(this.members);
        this.saveGang();
        return true;
    }

    removeMember(id) {
        const members = JSON.parse(this.members);
        const index = members.findIndex(member => member.id === id);
        if (index <= -1) {
            return false;
        }

        members.splice(index, 1);
        this.members = JSON.stringify(members);
        this.saveGang();
        return true;
    }

    setRank(player, value) {
        if (player.data.gang !== this.id) {
            return false;
        }

        const members = JSON.parse(this.members);
        const index = members.findIndex(member => member.id === id);
        if (index <= -1) {
            return false;
        }

        members[index].rank = value;
        this.members = JSON.stringify(members);
        this.saveGang();
        return true;
    }

    disband(player) {
        if (player.data.id !== this.id) {
            player.notify('You do not own this gang.');
            return false;
        }

        const index = gangs.findIndex(gang => gang.id === this.id);
        if (index <= -1) {
            player.notify('Could not find the gang.');
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
        db.deleteByIds(player.data.id, 'Gangs', res => {
            const players = alt.Player.all.filter(
                target => target.data && target.data.gang === this.id
            );

            if (players.length >= 1) {
                players.forEach(target => {
                    target.data.gang = -1;
                    target.saveField(target.data.id, 'gang', -1);
                    target.notify('The gang was disbanded.');
                });
            }
        });
        return true;
    }

    saveGang() {
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
        const index = currentTurfs.findIndex(currentID => currentID === id);
        if (index !== -1) {
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
        player.saveField(player.data.id, 'gang', player.data.id);
        gangs[parseInt(player.data.id)] = newGang;
        setupGangData(newGangData);
        player.notify('Gang was created.');
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

alt.on('grid:AddTurf', (id, turfID) => {
    id = parseInt(id);
    turfID = parseInt(turfID);
    if (!colshapes[turfID]) return;
    setTurfToNeutral(turfID);

    const foundGang = gangs.find(gang => gang.id === id);
    if (!foundGang) {
        return;
    }

    foundGang.addTurf(turfID, colshapes[turfID]);
});

alt.on('grid:EnterTurf', (player, colshape) => {
    if (player.dimension !== 0) return;
    if (!player.data) return;
    if (player.data.gang === -1) return;

    const ownerID = colshape.gangs.owner.id ? parseInt(colshape.gangs.owner.id) : -1;
    if (ownerID === parseInt(player.data.gang)) {
        player.notify(`[${colshape.sector.name}] Entered Your Gang's Turf`);
    }

    colshape.players.push(player);
});

alt.on('grid:ExitTurf', (player, colshape) => {
    const currentPlayers = [...colshape.players];
    const index = currentPlayers.findIndex(p => p === player);
    if (index <= -1) return;
    currentPlayers.splice(index, 1);
    colshape.players = currentPlayers;
});

alt.on('parse:Turfs', () => {
    colshapes.forEach((shape, turfID) => {
        if (Date.now() < shape.gangs.nextClaim) return;
        if (shape.players.length <= 0) return;
        const turfMembers = {};

        shape.players.forEach(player => {
            if (!player) {
                return;
            }

            if (!player.data) {
                return;
            }

            if (player.data.gang === -1) {
                return;
            }

            if (player.data.dead) {
                return;
            }

            if (player.dimension !== 0) {
                return;
            }

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

        const nextTime = Date.now() + shape.sector.seed.getNumber(30) * 60000;
        if (parseInt(shape.gangs.owner) === parseInt(selectedGang)) {
            shape.gangs.nextClaim = nextTime;
            return;
        }

        alt.emit('grid:AddTurf', selectedGang, turfID, nextTime);
    });
});
