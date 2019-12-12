import * as native from 'natives';
import * as alt from 'alt';

alt.log('Loaded: client->utility->screenfade.js');

export function fadeOut(ms) {
    native.doScreenFadeOut(ms);
}

export function fadeIn(ms) {
    native.doScreenFadeIn(ms);
}

export function fadeOutFadeIn(ms, msToOut) {
    fadeOut(ms);

    alt.setTimeout(() => {
        fadeIn(ms);
    }, msToOut);
}

export function blurOut(ms) {
    native.triggerScreenblurFadeOut(ms);
}

export function blurIn(ms) {
    native.triggerScreenblurFadeIn(ms);
}
