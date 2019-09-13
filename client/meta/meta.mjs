import * as alt from 'alt';

/**
 * Used to easily set values across various resources.
 * Using this to just help the player more.
 * @param name
 * @param value
 */
export function emit(key, value) {
    alt.Player.local.setMeta(key, value);
    alt.emit('meta:Changed', key, value);
}
