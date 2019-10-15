const fs = require('fs');
const download = require('download');
const path = require('path');
const platform = process.platform === 'win32' ? 'windows' : 'linux';
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const terms = {
    author: '\r\nAuthor: https://github.com/stuyk/ \r\n',
    license: 'License: GNU GENERAL PUBLIC LICENSE v3 \r\n',
    terms: [
        'By using this software for your Roleplay mode you agree to the following:',
        'Manipulation of bootscreen logos, and splash marks may not be removed. This data',
        'must be present and unmodified for each user that enters your server. Setting',
        'the agreement boolean below to true; means you AGREE to these terms and',
        'conditions. \r\n',
        'If you have any issues with these conditions; contact Stuyk promptly.',
        'If you agree with these terms. Please type true.',
        '\r\n\x1b[31mINSTALL POSTGRES V11.5 BEFORE RUNNING THIS\r\n\x1b[0m'
    ],
    do_you_agree: false
};

const dbDefault = {
    type: 'postgres',
    username: 'postgres',
    password: 'abc123',
    address: 'localhost',
    port: 5432,
    dbname: 'altv'
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
        readline.question(question, res => {
            if (!res) {
                res = undefined;
            }
            resolve(res);
        });
    });
}

async function downloadAll(urls) {
    console.log(`Downloading Latest alt:V Server Files.`);
    for (let i = 0; i < urls.length; i++) {
        console.log(urls[i].url);
        await download(urls[i].url, urls[i].destination).catch(err => {
            throw err;
        });
        console.log(`\r\n[${i + 1}/${urls.length}] Complete`);
    }

    console.log(
        `\r\nDownload Complete! Please run start.sh (Linux) or altv-server.exe (Windows)\r\n`
    );
    process.exit(0);
}

async function startup() {
    console.log(terms.author);
    console.log(terms.license);
    terms.terms.forEach(term => {
        console.log(term);
    });

    // Terms and Conditions
    const q1 = '\r\nPlease read the above terms and conditions. \r\n \r\n';
    let res = await question(q1);

    if (res !== 'true') {
        const error =
            '\x1b[31mFailed to read terms and conditions. Now exiting.\r\n\x1b[0m';
        console.log(error);
        process.exit(0);
    }

    const termPath = path.join(__dirname, '/resources/orp/terms-and-conditions.json');

    terms.do_you_agree = true;
    await new Promise(resolve => {
        fs.writeFile(termPath, JSON.stringify(terms, null, '\t'), () => {
            console.log('\r\n Terms written successfully. \r\n');
            resolve();
        });
    });

    // Database Setup
    const dbPath = path.join(
        __dirname,
        '/resources/orp/server/configuration/database.json'
    );

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
        fs.writeFile(dbPath, JSON.stringify(dbDefault, null, '\t'), () => {
            console.log('\r\nDatabase configured.\r\n');
            resolve();
        });
    });

    const q6 = '\r\nWhich alt:V Branch? 0: Stable, 1: Beta\r\n';
    res = await question(q6);

    if (!res) {
        res = 0;
    }

    if (parseInt(res) === 0) {
        windowsURLS.forEach(res => {
            res.url = res.url.replace('beta', 'stable');
        });

        console.log('You have selected the STABLE branch.');
    } else {
        console.log('You have selected the BETA branch.');
    }

    if (platform === 'windows') {
        downloadAll(windowsURLS);
    } else {
        downloadAll(linuxURLS);
    }
}

startup();
