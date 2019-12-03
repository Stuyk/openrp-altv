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
    alt.showCursor(false);

    while (cursorCount > 1) {
        cursorCount -= 1;
        try {
            alt.showCursor(false);
        } catch (e) {}
    }
}
