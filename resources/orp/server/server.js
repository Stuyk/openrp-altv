import * as alt from 'alt';
import fs from 'fs';

const file = './resources/orp/terms-and-conditions.json';

try {
    if (!fs.existsSync(file)) {
        throw new Error('Terms and Conditions not found. Please re-run `npm run orp`.');
    }

    const data = fs.readFileSync(file).toString();
    const terms = JSON.parse(data);
    if (terms.terms.length !== 10) {
        fs.renameSync(file, `${file}.${Math.floor(Math.random() * 50000)}`);
        throw new Error(
            '!!! => Terms and Conditions have changed. Please re-run `npm run orp`'
        );
    }

    if (!terms.do_you_agree)
        throw new Error(
            'Please read the terms and conditions and modify accordingly under terms-and-conditions.json'
        );
    /* jshint ignore:start */
    import('./startup.js');
    /* jshint ignore:end */
} catch (err) {
    console.log(
        `!!! => Failed to setup ORP properly. Please run 'npm run orp' in the base directory.`
    );
}
