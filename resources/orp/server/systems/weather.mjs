import * as alt from 'alt';
import { colshapes } from './grid.mjs';

let lastUpdate = Date.now();

const weatherCycle = [
    0, // Extra sunny
    0, // Extra sunny
    0, // Extra sunny
    0, // Extra sunny
    0, // Extra sunny
    0, // Extra sunny
    0, // Extra sunny
    1, // Clear
    2, // Clouds
    2, // Clouds
    4, // Foggy
    5, // Overcast
    8, // Light Rain
    6, // Rain
    6, // Rain
    7, // Thunder
    7, // Thunder
    6, // Rain
    8, // Light Rain
    5, // Overcast
    2, // Clouds
    1, // Clear
    1 // Clear
];

const weatherGroups = [];
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
    lastUpdate = now + 60000 * 10;

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
        player.setWeather(weather.weatherType);
    });
});
