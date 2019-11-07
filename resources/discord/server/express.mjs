import * as alt from 'alt';
import express from 'express';
import fs from 'fs';
import request from 'request';
import path from 'path';
import externalIP from 'external-ip';
import { fetchPlayerByIP } from './utility.mjs';

const getIp = externalIP();
const app = express();
const port = 17888;
const data = JSON.parse(
    fs.readFileSync(
        path.join(alt.getResourcePath('discord'), '/server/configuration.json')
    )
);

let remoteIP = '0.0.0.0';

getIp((err, ip) => {
    if (err) {
        throw err;
    }

    remoteIP = ip;
    setupEndpoints();
});

export function getEndPoint() {
    return `http://${remoteIP}:${port}/`;
}

export function getRemoteIP() {
    return remoteIP;
}

function setupEndpoints() {
    app.get('/', (req, res) => {
        let address = res.connection.remoteAddress;

        if (address.includes(remoteIP)) {
            address = '::ffff:127.0.0.1';
        }

        /*
        const player = fetchPlayerByIP(address);
        if (!player) {
            res.send('You seem lost.');
            return;
        }
        */

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
            const getData = request.get('https://discordapp.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${userData.access_token}`
                }
            });

            getData.on('data', newData => {
                try {
                    let address = res.connection.remoteAddress;
                    if (address.includes(remoteIP)) {
                        address = '::ffff:127.0.0.1';
                    }

                    alt.emit('discord:ParseLogin', address, newData.toString());
                } catch (err) {
                    console.log('Failed to authorization user.');
                }

                /*
                const revokeRequest = request.post(
                    'https://discordapp.com/api/oauth2/token/revoke',
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization: `Bearer ${userData.access_token}`
                        },
                        formData: {
                            client_id: data.client_id,
                            client_secret: data.client_secret,
                            token: userData.access_token,
                            token_type_hint: 'access_token'
                        }
                    }
                );

                revokeRequest.on('data', (req, res) => {
                    console.log(req.toString());
                });

                revokeRequest.on('error', res => {
                    console.log(res);
                });
                */
            });
        });

        postRequest.on('error', () => {
            res.redirect('/');
        });
    });

    app.listen(port, () => {
        alt.log(`Starting Discord Service on Port: ${port}`);
    });
}
