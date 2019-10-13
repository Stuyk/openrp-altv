import * as alt from 'alt';
import { verifyWeapon } from '../systems/anticheat.mjs';

alt.on('weaponDamage', (attacker, target, weapon, damage, offset, bodyPart) => {
    if (attacker.constructor.name !== 'Player') return;

    if (target.hasDied) {
        return false;
    }

    // Tazer
    if (weapon === 911657153) {
        return tazer(attacker, target);
    }

    if (weapon !== 133987706 && weapon !== 2741846334 && weapon !== 2725352035) {
        if (!verifyWeapon(attacker)) {
            return false;
        }
    }
});

function tazer(attacker, target) {
    target.setSyncedMeta('tazed', true);
    alt.emitClient(target, 'arrest:Tazed', 10000);
    setTimeout(() => {
        if (!target) return;
        target.setSyncedMeta('tazed', false);
    }, 10000);
    return false;
}
