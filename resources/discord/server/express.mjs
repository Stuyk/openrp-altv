import * as alt from 'alt';
import externalIP from 'external-ip';
import express from 'express';
import request from 'request';
import path from 'path';
import fs from 'fs';

const app = express();
const getIp = externalIP();
const port = 17888;
const data = JSON.parse(
    fs.readFileSync(
        path.join(alt.getResourcePath('discord'), '/server/configuration.json')
    )
);

let remoteIP;

getIp((err, ip) => {
    if (err) {
        throw err;
    }

    remoteIP = ip;
    setupEndpoints();
});

export function getEndpoint() {
    return `http://${remoteIP}:${port}/`;
}

function setupEndpoints() {
    app.get('/', (req, res) => {
        res.redirect(
            `https://discordapp.com/api/oauth2/authorize?client_id=${data.client_id}&response_type=code&scope=identify%20email&redirect_uri=http://${remoteIP}:${port}/login`
        );
    });

    app.get('/login', async (req, res) => {
        if (req.query.error) {
            res.redirect('/');
            return;
        }

        const userAuthorizationCode = req.query.code;
        const postRequest = request.post('https://discordapp.com/api/oauth2/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            formData: {
                client_id: data.client_id,
                client_secret: data.client_secret,
                redirect_uri: `http://${remoteIP}:${port}/login`,
                grant_type: 'authorization_code',
                code: userAuthorizationCode
            }
        });

        postRequest.on('data', d => {
            const userData = JSON.parse(d.toString());
            res.send(
                `<script>let token = '${userData.access_token}'; if (window.alt) { alt.emit('discord:Token', token); }</script>`
            );
        });

        postRequest.on('error', () => {
            res.redirect('/');
        });
    });

    app.listen(port, () => {
        alt.log(`Starting Discord Service on Port: ${port}`);
    });
}

alt.onClient('discord:Authorize', (player, token) => {
    console.log('Authorizing...');

    const getData = request.get('https://discordapp.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    getData.on('data', discordData => {
        const data = discordData.toString();
        alt.emit('discord:ParseLogin', player, data);
    });

    getData.on('error', err => {
        console.log(`${player.name} was kicked for false identification.`);
        player.kick();
    });
});

alt.onClient('discord:Kick', player => {
    player.kick();
    console.log('Player was kicked for invalid token.');
});
