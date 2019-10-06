import * as alt from 'alt';
import { verifyWeapon } from '../systems/anticheat.mjs';

alt.on('weaponDamage', (attacker, target, weapon, damage, offset, bodyPart) => {
    if (weapon !== 133987706 && weapon !== 2741846334 && weapon !== 2725352035) {
        if (!verifyWeapon(attacker)) {
            return false;
        }
    }
});
