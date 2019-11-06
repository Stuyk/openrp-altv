import * as alt from 'alt';
import { Config } from '../configuration/config.mjs';
import { colshapes } from './grid.mjs';

const weatherGroups = [];
const weatherCycle = Config.weatherCycle;
const weatherCycleTime = Config.weatherCycleTime;

let lastUpdate = Date.now();

colshapes.forEach((shape, index) => {
    // Get Even Numbers Only
    if (shape.sector.x % 4 === 0 && shape.sector.y % 4 === 0) {
        const shapes = colshapes.filter(current => {
            if (
                current.sector.x >= shape.sector.x &&
                current.sector.x < shape.sector.x + 4 &&
                current.sector.y >= shape.sector.y &&
                current.sector.y < shape.sector.y + 4
            )
                return current;
        });
        weatherGroups.push(shapes);
    }
});

alt.on('interval:Player', () => {
    const now = Date.now();
    if (now < lastUpdate) return;
    lastUpdate = now + weatherCycleTime;

    weatherGroups.forEach((group, index) => {
        const newWeatherIndex = Math.floor(Math.random() * weatherCycle.length);
        group.forEach(colshape => {
            const weather = colshape.getMeta('weather');
            if (!weather) {
                const weatherType = weatherCycle[newWeatherIndex];
                colshape.setMeta('weather', {
                    weatherIndex: newWeatherIndex,
                    weatherType
                });
            } else {
                let weatherIndex = weather.weatherIndex + 1;
                if (weatherIndex > weatherCycle.length - 1) {
                    weatherIndex = 0;
                }
                colshape.setMeta('weather', {
                    weatherIndex,
                    weatherType: weatherCycle[weatherIndex]
                });
            }
        });
    });

    const players = [...alt.Player.all];
    players.forEach(player => {
        if (!player.colshape) return;
        const weather = player.colshape.getMeta('weather');
        if (weather === null) return;
        alt.emitClient(player, 'transition:Weather', weather.weatherType);
    });
});
