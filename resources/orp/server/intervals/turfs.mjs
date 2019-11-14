import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';
import { colshapes } from '../systems/grid.mjs';

setInterval(handleTurfInterval, Config.nextTurfCheckTime);

function handleTurfInterval() {
    alt.emit('parse:Turfs');
}
