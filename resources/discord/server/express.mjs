import * as alt from 'alt';
import express from 'express';
import request from 'request';
import externalIP from 'external-ip';
import config from './config.mjs';

const app = express();
const getIp = externalIP();
let remoteIP = '0.0.0.0';

if (config.local) {
    remoteIP = '127.0.0.1';
    setupEndpoints();
} else {
    getIp((err, ip) => {
        if (err) {
            throw err;
        }

        remoteIP = ip;
        setupEndpoints();
    });
}

export function getEndpoint() {
    return `http://${remoteIP}:${config.port}/`;
}

function setupEndpoints() {
    app.get('/', (req, res) => {
        res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.client_id}&response_type=code&scope=identify%20email&redirect_uri=http://localhost:${config.port}/callback`);
    });

    app.get('/callback', async (req, res) => {
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
                client_id: config.client_id,
                client_secret: config.client_secret,
                redirect_uri: `http://localhost:${config.port}/callback`,
                grant_type: 'authorization_code',
                code: userAuthorizationCode
            }
        });

        postRequest.on('data', d => {
            const userData = JSON.parse(d.toString());
            const getData = request.get('https://discordapp.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${userData.access_token}`
                }
            });

            getData.on('data', newData => {
                try {
                    res.send(`<script>let data = ${newData}; if (window.alt) { alt.emit('discord:data', data); }</script>`);
                } catch (err) {
                    console.log('Failed to authorization user.');
                }
            });
        });

        postRequest.on('error', () => {
            res.redirect('/');
        });
    });

    app.listen(config.port, () => {
        alt.log(`Starting Discord Service on Port: ${config.port}`);
    });
}