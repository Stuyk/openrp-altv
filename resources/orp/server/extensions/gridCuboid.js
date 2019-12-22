import * as alt from 'alt';
import { Config } from '../configuration/config.js';

const weatherCycle = Config.weatherCycle;
const weatherCycleTime = Config.weatherCycleTime;

// Do not use this for anything other than turfing/weather systems.
export class GridCuboid extends alt.ColshapeCuboid {
    constructor(x1, y1, z1, x2, y2, z2) {
        super(x1, y1, z1, x2, y2, z2);
        this.players = [];
        this.nextTurfTime = Date.now() + 60000;
        this.factions = {
            owner: { id: -2 }
        };

        setTimeout(() => {
            this.update();
        }, Math.floor(Math.random() * 120000) + 10000);
    }

    setupTimeout(nextUpdateTime) {
        setTimeout(() => {
            this.update();
        }, nextUpdateTime);
    }

    update() {
        const randomValue = this.sector.seed.getNumber(Config.turfHighestWaitTime);
        const nextTime = randomValue * 60000 + 60000 * 10; // 10 - 45 Minutes
        this.setupTimeout(nextTime);

        if (this.players.length <= 0) {
            return;
        }

        // Push Turf Update
        const validPlayers = this.players.filter(
            player =>
                player && // is player
                player.valid &&
                player.data && // has data
                player.data.faction >= 0 && // is in a faction
                !player.data.dead && // is not dead
                player.dimension === 0 // is in dimension 0
        );

        if (validPlayers.length <= 0) {
            return;
        }

        alt.emit('turf:Update', this, validPlayers);
    }

    addPlayer(player) {
        if (!this.players.includes(player)) {
            this.players.push(player);
        }

        const isPvPEnabled = this.factions.owner.id !== -2;
        alt.emitClient(player, 'combat:ToggleCombat', isPvPEnabled);
        alt.emitClient(player, 'blip:CleanSectorBlips'); // Remove all sector blips
        alt.emitClient(player, 'blip:CreateSectorBlip', this.sector); // Show the sector blip, the user is currently in
        alt.emitClient(player, 'door:RenderDoors', this.sector.doors);

        const weather = this.getMeta('weather');
        if (weather !== null) {
            alt.emitClient(
                player,
                'transition:Weather',
                weather.weatherType,
                weather.lastWeather
            );
        }
    }

    resync() {
        if (this.players.length <= 0) {
            return;
        }

        this.players.forEach(player => {
            if (!player || !player.valid) {
                return;
            }

            const isPvPEnabled = this.factions.owner.id !== -2;
            alt.emitClient(player, 'combat:ToggleCombat', isPvPEnabled);
            alt.emitClient(player, 'blip:CleanSectorBlips'); // Remove all sector blips
            alt.emitClient(player, 'blip:CreateSectorBlip', this.sector); // Show the sector blip, the user is currently in
            alt.emitClient(player, 'door:RenderDoors', this.sector.doors);
        });
    }

    rmvPlayer(player) {
        if (!this.players.includes(player)) {
            return;
        }

        const index = this.players.findIndex(p => p && p === player);
        if (index <= -1) {
            return;
        }

        this.players.splice(index, 1);
    }

    setupWeather(startingWeather) {
        const weatherType = weatherCycle[startingWeather];
        this.setMeta('weather', {
            lastWeather: startingWeather,
            weatherIndex: startingWeather,
            weatherType
        });

        setTimeout(() => {
            this.nextWeather();
        }, Config.weatherCycleTime);
    }

    nextWeather() {
        const weather = this.getMeta('weather');
        let newWeatherIndex = weather.weatherIndex + 1;
        if (newWeatherIndex > weatherCycle.length - 1) {
            newWeatherIndex = 0;
        }

        const newWeatherData = {
            lastWeather: weather.weatherIndex,
            weatherIndex: newWeatherIndex,
            weatherType: weatherCycle[newWeatherIndex]
        };
        this.setMeta('weather', newWeatherData);

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (!player.valid) {
                continue;
            }

            alt.emitClient(
                player,
                'transition:Weather',
                newWeatherData.weatherType,
                newWeatherData.lastWeather
            );
        }

        setTimeout(() => {
            this.nextWeather();
        }, Config.weatherCycleTime);
    }
}
