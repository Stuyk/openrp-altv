import * as alt from 'alt';

let cursorCount = 0;

export function showCursor(value) {
    if (value) {
        cursorCount += 1;
        alt.showCursor(true);
        return;
    }

    cursorCount -= 1;
    if (cursorCount <= -1) {
        cursorCount = 0;
        return;
    }

    alt.showCursor(false);
}
