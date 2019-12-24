import * as native from 'natives';

export function helpText(data) {
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName(data);
    native.endTextCommandDisplayHelp(0, false, false, -1);
}
