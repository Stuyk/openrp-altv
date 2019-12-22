import * as alt from 'alt';
import { Config } from '../configuration/config.js';
import { colshapes } from './grid.js';

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

        const newWeatherIndex = Math.floor(Math.random() * weatherCycle.length);
        shapes.forEach(shape => {
            shape.setupWeather(newWeatherIndex);
        });
    }
});