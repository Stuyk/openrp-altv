import * as native from 'natives';
import * as alt from 'alt';

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
    native.transitionFromBlurred(ms);
}

export function blurIn(ms) {
    native.transitionToBlurred(ms);
}
