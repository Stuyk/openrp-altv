import * as alt from 'alt';
import { details, updateField } from './details.mjs';
import { generateHash } from '../utility/encryption.mjs';
import { quitJob } from '../systems/job.mjs';
import { addXP } from '../systems/skills.mjs';
import { distance } from '../utility/vector.mjs';
import { uncuffPlayer } from '../systems/use.mjs';

const jailCells = [
    { x: 460.0222473144531, y: -994.3084716796875, z: 24.91487693786621 },
    { x: 459.3919982910156, y: -998.1002807617188, z: 24.91488265991211 },
    { x: 459.47198486328125, y: -1001.6260986328125, z: 24.914875030517578 }
];

const charges = [
    { name: 'Murder', amount: 5000, xp: -75 },
    { name: 'Speeding', amount: 100, xp: -10 }
];

/**
 * Add a user to the Police MDC.
 * @param victim
 * @param attacker
 * @param reason
 */
export function appendToMdc(victim, attacker, reason) {
    if (!details.mdc) {
        details.mdc = [];
        currentMdc = [];
    }

    const mdc = JSON.parse(details.mdc);
    mdc.push({
        victim,
        attacker,
        reason,
        hash: generateHash(JSON.stringify(victim.data))
    });
    updateField('mdc', mdc);
}

/**
 * Remove a user from the Police MDC
 * @param player
 * @returns Array of charges.
 */
export function removeFromMdc(player) {
    const mdc = JSON.parse(details.mdc);
    const chargedFor = mdc.filter(x => x.attacker === player.data.name);
    const filtered = mdc.filter(x => x.attacker !== player.data.name);
    updateField('mdc', filtered);
    return chargedFor;
}

export function lookupByHash(hash) {
    const mdc = JSON.parse(details.mdc);
    const criminalData = mdc.find(x => x.hash === hash);

    if (!criminalData) {
        return undefined;
    }

    const criminal = alt.Player.all.find(x => x.data.name === criminalData.attacker);
    return criminal;
}

/**
 * Forwards the MDC to the requester.
 */
alt.onClient('mdc:GetData', player => {
    const mdcData = JSON.parse(details.mdc);
    const online = mdcData.filter(pcase => {
        let res = alt.Player.all.find(p => {
            if (p.data && p.data.name === pcase.attacker) return p;
        });

        if (res) return pcase;
    });

    alt.emitClient(player, 'mdc:Data', JSON.stringify(online));
});

alt.onClient('mdc:Pursue', (player, hash) => {
    if (!player.job) return;
    if (!player.job.name.includes('Officer')) return;
    const criminal = lookupByHash(hash);
    if (!criminal) {
        quitJob(player, false, true);
        player.send('{FF0000}That player is not logged in the MDC.');
        addXP(player, 'nobility', -100);
        return;
    }

    if (distance(player.pos, criminal.pos) > 50) {
        player.send('{FF0000} You are not close enough to be in pursuit.');
        return;
    }

    const otherOfficers = alt.Player.all.filter(x => {
        if (x.job && x.job.name.includes('Officer')) return x;
    });

    otherOfficers.forEach(officer => {
        officer.send(
            `{0099ff}${player.data.name} is in pursuit of suspect ${criminal.data.name}.`
        );

        if (player.sector) {
            officer.send(`{0099ff} Sector: [${player.sector.x}, ${player.sector.y}]`);
        }
    });
});

alt.onClient('mdc:TurnIn', (player, hash) => {
    if (!player.job) return;
    if (!player.job.name.includes('Officer')) return;
    if (!player.cuffedPlayer) return;

    if (!player.isInPoliceBooking) {
        player.send('You must be in the police booking area; to turn in a criminal.');
        return;
    }

    const criminal = lookupByHash(hash);
    if (!criminal) {
        quitJob(player, false, true);
        player.send('{FF0000}That player is not logged in the MDC.');
        addXP(player, 'nobility', -100);
        return;
    }

    if (player.cuffedPlayer !== criminal) {
        player.send('You cannot turn in a user you did not arrest.');
        return;
    }

    if (distance(player.pos, player.cuffedPlayer) > 10) {
        player.send('Criminal you are trying to book is too far away.');
        return;
    }

    const criminalCharges = removeFromMdc(criminal);
    let amount = 0;
    criminalCharges.forEach(charge => {
        let foundCharge = charges.find(x => x.name === charge.reason);
        if (!foundCharge) {
            console.log('Charge was not found.');
            return;
        }

        addXP(criminal, 'notoriety', foundCharge.xp);
        addXP(player, 'nobility', Math.abs(foundCharge.xp));
        amount += foundCharge.amount;
        criminal.send(`Charges: ${charge.reason}`);
    });

    let randomCell = Math.floor(Math.random() * (jailCells.length - 1));
    criminal.subToZero(parseInt(amount));
    criminal.removeItemsOnArrest();
    criminal.send(`{FF0000}- $${amount} | Removed from Bank and Cash Assets.`);
    criminal.send(`{FFFF00}All weapons and unrefined goods were confiscated.`);
    criminal.pos = jailCells[randomCell];
    criminal.syncDoorStates();
    uncuffPlayer(player, criminal);
});
