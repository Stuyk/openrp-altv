import * as alt from 'alt';
import { verifyWeapon } from '../systems/anticheat.mjs';

alt.on('weaponDamage', (attacker, target, weapon, damage, offset, bodyPart) => {
    if (weapon !== 2725352035) {
        if (!verifyWeapon(attacker)) {
            return false;
        }
    }
});
