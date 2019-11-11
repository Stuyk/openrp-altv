import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';
import { colshapes } from '../systems/grid.mjs';

let nextTurfClaimTime = Date.now() + 60000;

setInterval(handleTurfInterval, 60000);

function handleTurfInterval() {
    if (Date.now() < nextTurfClaimTime) return;
    nextTurfClaimTime = Date.now() + 60000; // Make this random.
    alt.emit('parse:Turfs');
}
