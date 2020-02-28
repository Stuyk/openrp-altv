import { existsSync, writeFile, copyFile } from 'fs';
import download from 'download';
import { join } from 'path';
import { exec } from 'child_process';
import readline from 'readline';

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import path from 'path';
const __dirname = path.resolve();

const platform = process.platform === 'win32' ? 'windows' : 'linux';

const terms = {
    author: '\r\nAuthor: https://github.com/stuyk/ \r\n',
    terms: [
        'By using this software for your Roleplay mode you agree to the following:',
        'Manipulation of bootscreen logos, and splash marks may not be removed. This data',
        'must be present and unmodified for each user that enters your server. Monetization ',
        'of this game mode is STRICTLY PROHIBITED. You may NOT establish any form of monetization',
        'features in this gamemode. \r\n',
        'Setting the agreement boolean below to true; means you AGREE to these terms and',
        'conditions. If you wish to monetize this gamemode. Contact Stuyk. \r\n',
        'If you have any issues with these conditions; contact Stuyk promptly.',
        'If you agree with these terms. Please type true.',
        '\r\n\x1b[31mINSTALL POSTGRES V11.5 BEFORE RUNNING THIS\r\n\x1b[0m'
    ],
    do_you_agree: false
};

let dbDefault = {
    type: 'postgres',
    username: 'postgres',
    password: 'abc123',
    address: 'localhost',
    port: 5432,
    dbname: 'altv'
};

let discordAppInfo = {
    discord: '',
    token: ''
};

let windowsURLS = [
    {
        url: `https://cdn.altv.mp/node-module/beta/x64_win32/update.json`,
        destination: '.'
    },
    {
        url: `https://cdn.altv.mp/node-module/beta/x64_win32/modules/node-module.dll`,
        destination: './modules'
    },
    {
        url: `https://cdn.altv.mp/node-module/beta/x64_win32/libnode.dll`,
        destination: '.'
    },
    {
        url: `https://cdn.altv.mp/server/beta/x64_win32/altv-server.exe`,
        destination: '.'
    },
    {
        url: `https://cdn.altv.mp/server/beta/x64_win32/data/vehmodels.bin`,
        destination: './data'
    },
    {
        url: `https://cdn.altv.mp/server/beta/x64_win32/data/vehmods.bin`,
        destination: './data'
    }
];

let linuxURLS = [
    {
        url: `https://cdn.altv.mp/node-module/beta/x64_linux/update.json`,
        destination: '.'
    },
    {
        url: `https://cdn.altv.mp/node-module/beta/x64_linux/modules/libnode-module.so`,
        destination: './modules'
    },
    {
        url: `https://cdn.altv.mp/node-module/beta/x64_linux/libnode.so.72`,
        destination: '.'
    },
    {
        url: `https://cdn.altv.mp/server/beta/x64_linux/altv-server`,
        destination: '.'
    },
    {
        url: `https://cdn.altv.mp/server/beta/x64_linux/data/vehmodels.bin`,
        destination: './data'
    },
    {
        url: `https://cdn.altv.mp/server/beta/x64_linux/data/vehmods.bin`,
        destination: './data'
    },
    {
        url: `https://cdn.altv.mp/others/start.sh`,
        destination: '.'
    }
];

async function question(question) {
    return new Promise(resolve => {
        rl.question(`\x1b[32m${question}\x1b[0m`, res => {
            if (!res) {
                res = undefined;
            }
            resolve(res);
        });
    });
}

async function downloadAll(urls) {
    return new Promise(async resolve => {
        for (let i = 0; i < urls.length; i++) {
            console.log(urls[i].url);
            await download(urls[i].url, urls[i].destination).catch(err => {
                throw err;
            });
            console.log(`\r\n[${i + 1}/${urls.length}] Complete`);
        }

        resolve();
    });
}

async function startup() {
    console.log(terms.author);
    terms.terms.forEach(term => {
        console.log(term);
    });

    const termPath = join(__dirname, '/resources/orp/terms-and-conditions.json');
    let res;

    if (!existsSync(termPath)) {
        // Terms and Conditions
        const q1 = '\r\nPlease read the above terms and conditions. \r\n \r\n';
        res = await question(q1);

        if (res !== 'true') {
            const error =
                '\x1b[31mFailed to read terms and conditions. Now exiting.\r\n\x1b[0m';
            console.log(error);
            process.exit(0);
        }

        terms.do_you_agree = true;
        await new Promise(resolve => {
            writeFile(termPath, JSON.stringify(terms, null, '\t'), () => {
                console.log('\r\n Terms written successfully. \r\n');
                resolve();
            });
        });
    }

    // Database Setup
    const dbPath = join(__dirname, '/resources/orp/server/configuration/database.json');

    const newDatabase = 'Setup new database? (y/n) Default is y \r\n';
    res = await question(newDatabase);

    if (!res) res = 'y';

    if (res === 'y') {
        const q2 =
            'Please enter your POSTGRES database address. ie. `localhost` or `127.0.0.1` \r\nPress Enter for Default (localhost) \r\n';
        res = undefined;
        res = await question(q2);

        if (res) {
            dbDefault.address = res;
            res = undefined;
        }

        const q3 =
            'Please enter your POSTGRES port. ie. 5432 \r\nPress Enter for Default (5432)\r\n';
        res = await question(q3);

        if (res) {
            dbDefault.port = parseInt(res);
            res = undefined;
        }

        const q4 =
            'Please enter your POSTGRES username. ie. Johnny \r\nPress Enter for Default (postgres)\r\n';
        res = await question(q4);

        if (res) {
            dbDefault.username = res;
            res = undefined;
        }

        const q5 =
            'Please enter your POSTGRES password. ie. abc123 \r\nPress Enter for Default (abc123)\r\n';
        res = await question(q5);

        if (res) {
            dbDefault.password = res;
            res = undefined;
        }

        await new Promise(resolve => {
            writeFile(dbPath, JSON.stringify(dbDefault, null, '\t'), () => {
                console.log('\r\nDatabase configured.\r\n');
                resolve();
            });
        });
    } else {
        console.log('\r\nSkipping DB setup.');
    }

    const newDiscordInfo =
        'Setup new Discord information for Login Data? (y/n). Default is y\r\n';
    res = await question(newDiscordInfo);

    if (!res) res = 'y';

    if (res === 'y') {
        res = undefined;

        console.log('!!! IMPORTANT INFORMATION FOR DISCORD SETUP !!!');
        console.log('Please Create a Discord Application for your Login System.');
        console.log('Please Visit: https://discordapp.com/developers/applications/');
        console.log('1. Hit New Application');
        console.log('2. Set the Name for Your Bot / Application');
        console.log('3. Click on the `Bot` tab.');
        console.log('4. Transform your Application into a bot.');
        console.log('5. Name your bot.');
        console.log('6. Tick `Administrator` or just `Send/Read Messages`');
        console.log('7. Copy the bots secret token.');
        console.log('8. Make sure the bot is not public.');
        console.log('9. Navigate to oAuth2 tab. Tick `bot` in scopes.');
        console.log('10. Copy the URL inside of scopes. Paste in browser.');
        console.log('11. Add the bot to your designated Discord.');

        const discordBotTokenQ = '\r\nPlease enter your BOT SECRET TOKEN... \r\n';
        res = await question(discordBotTokenQ);

        if (res) {
            discordAppInfo.token = res;
            res = undefined;
        }

        const discordPublicURLQ =
            '\r\nPlease enter a public discord url to display to users so they can join. \r\n';
        res = await question(discordPublicURLQ);

        if (res) {
            discordAppInfo.discord = res;
            res = undefined;
        }

        const discordConfigPath = join(
            __dirname,
            '/resources/orp/server/discord/configuration.json'
        );

        await new Promise(resolve => {
            writeFile(
                discordConfigPath,
                JSON.stringify(discordAppInfo, null, '\t'),
                () => {
                    console.log('\r\nDiscord Login Configured\r\n');
                    resolve();
                }
            );
        });
    }

    console.log(`Downloading Latest alt:V Server Files.`);
    const q6 = '\r\nWhich alt:V Branch? 0: Release, 1: RC, 2: Dev [Default: Release]\r\n';
    res = await question(q6);

    if (!res) {
        res = 0;
    }

    if (parseInt(res) === 0) {
        if (platform === 'windows') {
            console.log('Windows');
            windowsURLS.forEach(res => {
                res.url = res.url.replace('beta', 'release');
            });
            console.log('You have selected the RELEASE branch.');
        } else {
            console.log('Linux');
            linuxURLS.forEach(res => {
                res.url = res.url.replace('beta', 'release');
            });
            console.log('You have selected the RELEASE branch.');
        }
    }

    if (parseInt(res) === 1) {
        console.log('You have selected the RC branch.');
    }

    if (parseInt(res) === 2) {
        if (platform === 'windows') {
            windowsURLS.forEach(res => {
                res.url = res.url.replace('beta', 'dev');
            });
            console.log('You have selected the DEV branch.');
        } else {
            linuxURLS.forEach(res => {
                res.url = res.url.replace('beta', 'dev');
            });
            console.log('You have selected the DEV branch.');
        }
    }

    if (platform === 'windows') {
        await downloadAll(windowsURLS);
    } else {
        await downloadAll(linuxURLS);
    }

    // Copy server.cfg
    const serverCfgFile = join(__dirname, '/server.cfg');
    if (!existsSync(serverCfgFile)) {
        copyFile(serverCfgFile + '.example', serverCfgFile, err => {
            if (err) throw err;
            console.log('server.cfg.example was copied to server.cfg');
        });
    }

    console.log(
        `\r\n\x1b[36mDownload Complete! Please run start.sh (Linux) or altv-server.exe (Windows)\r\n\x1b[0m`
    );

    if (platform !== 'windows') {
        exec('chmod +x ./start.sh', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
        });

        exec('chmod +x ./altv-server', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    process.exit(0);
}

startup();
