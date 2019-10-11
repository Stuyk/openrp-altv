import * as alt from 'alt';
import { details, updateField } from './details.mjs';

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
    mdc.push({ victim, attacker, reason });
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

/**
 * Forwards the MDC to the requester.
 */
alt.onClient('mdc:GetData', player => {
    player.emitMeta('mdc:Data', details.mdc);
});
