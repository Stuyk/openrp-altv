import * as alt from 'alt';
import { Config } from '../configuration/config.js';
import { colshapes } from '../systems/grid.js';

setInterval(handleTurfInterval, Config.nextTurfCheckTime);

function handleTurfInterval() {
    alt.emit('parse:Turfs');
}
