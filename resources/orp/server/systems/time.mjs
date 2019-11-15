import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';

const startHour = Config.startHour;
const minutesPerMinute = Config.minutesPerMinute;
const hoursPerSixtyMinutes = Config.hoursPerSixtyMinutes;

let time = {
    hour: startHour,
    minute: 0
};

// 30 Minutes = 1 Hour
let lastUpdate = Date.now() + 60000;

alt.on('interval:Player', () => {
    const now = Date.now();
    if (now < lastUpdate) {
        return;
    }
    lastUpdate = now + 60000;
    time.minute += minutesPerMinute;
    if (time.minute >= 60) {
        time.minute = 0;
        time.hour += hoursPerSixtyMinutes;
    }

    if (time.hour >= 24) {
        time.hour = 0;
    }

    alt.emitClient(null, 'time:SetTime', time.hour, time.minute);
    const players = [...alt.Player.all];
    if (players.length <= 0) return;
    const today = new Date();
    players.forEach(player => {
        player.setDateTime(
            today.getDay(),
            today.getMonth(),
            today.getFullYear(),
            time.hour,
            time.minute,
            0
        );
    });
});

export function updatePlayerTime(player) {
    if (!player) return;
    const today = new Date();
    player.setDateTime(
        today.getDay(),
        today.getMonth(),
        today.getFullYear(),
        time.hour,
        time.minute,
        0
    );
    alt.emitClient(null, 'time:SetTime', time.hour, time.minute);
}
