import * as alt from 'alt';
import { get } from 'https';
import config from './configuration.json';
import Discord from 'discord.js';

const client = new Discord.Client();
alt.log('!!! => Loading Discord Bot');

alt.onClient('discord:BearerToken', parseBearerToken);

client.on('ready', () => {
    alt.log('!!! => Discord bot has authenticated successfully...');
});

client.on('error', err => {
    alt.log(err);
});

client.on('rateLimit', rateLimit => {
    alt.log('Rate Limit Exceeded...');
    alt.log(rateLimit);
});

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === 'dm') {
        const author = await client.fetchUser(msg.author.id).catch(err => {
            console.log('Could not fetch author.');
            console.log(err);
            return;
        });

        if (!author) return;

        if (!msg.content.includes('!login')) {
            await author.send('`!login <token>`').catch(err => {
                console.log('Could not send message to user from bot.');
                console.log(err);
                return;
            });
            return;
        }

        const playersUnfiltered = [...alt.Player.all];
        const players = playersUnfiltered.filter(
            player => player && !player.data && player.token
        );

        const player = players.find(player => player.token === msg.content.split(' ')[1]);
        if (!player) {
            await author.send('Are you sure you are in-game?').catch(err => {
                console.log('Could not send message to user from bot.');
                console.log(err);
                return;
            });
            return;
        }

        player.token = undefined;
        delete player.token;
        await author.send('You are now being logged in.').catch(err => {
            console.log('Could not send message to user from bot.');
            console.log(err);
            return;
        });

        alt.emitClient(player, 'discord:Done');
        alt.emit('discord:FinishLogin', player, {
            id: msg.author.id,
            username: msg.author.username,
            discriminator: msg.author.discriminator
        });
    }
});

// Establish Connection
client.login(config.token);

async function parseBearerToken(player, bearerToken) {
    const result = await new Promise(resolve => {
        get(
            'https://discordapp.com/api/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            },
            res => {
                res.on('data', d => {
                    resolve({ statusCode: res.statusCode, data: d.toString() });
                });
            }
        ).on('error', e => {
            return resolve({ statusCode: e.statusCode, data: '' });
        });
    });

    if (result.statusCode !== 200) {
        return;
    }

    const data = JSON.parse(result.data);
    player.token = undefined;
    delete player.token;
    alt.emitClient(player, 'discord:Done');
    alt.emit('discord:FinishLogin', player, {
        id: data.id,
        username: data.username,
        discriminator: data.discriminator
    });
}
