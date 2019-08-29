import * as TermsAndConditions from './configuration/terms-and-conditions.mjs'; // Terms & Conditions

import fs from 'fs';

if (!fs.existsSync('./resources/orp/terms-and-conditions.json')) {
    fs.writeFileSync(
        './resources/orp/terms-and-conditions.json',
        JSON.stringify(TermsAndConditions.data, '', '\t')
    );
    throw new Error(
        'Please read the terms and conditions and modify accordingly under terms-and-conditions.json'
    );
} else {
    const data = fs.readFileSync('./resources/orp/terms-and-conditions.json').toString();
    const parsed = JSON.parse(data);
    if (!parsed.do_you_agree)
        throw new Error(
            'Please read the terms and conditions and modify accordingly under terms-and-conditions.json'
        );
    import('./startup.mjs');
}

function defer() {
    let deferred = {
        promise: null,
        reject: null,
        resolve: null
    };

    deferred.promise = new Promise((resolve, reject) => {
        deferred.reject = reject;
        deferred.resolve = resolve;
    });

    return deferred;
}

let john = {};

async function createDefer() {
    let def = defer();
    john.def = def;
    return john.def.promise;
}

createDefer()
    .then(res => {
        console.log('yes');
    })
    .catch(res => {
        console.log('reject');
    });

setTimeout(() => {
    john.def.resolve();
}, 2000);
