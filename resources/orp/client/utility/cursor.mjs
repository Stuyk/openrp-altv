import * as alt from 'alt';

alt.log('Loaded: client->utility->cursor.mjs');

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

    try {
        for (let i = 0; i < 25; i++) {
            alt.showCursor(false);
        }
    } catch (e) {}
}
