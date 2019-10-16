import fs from 'fs';

try {
    const data = fs.readFileSync('./resources/orp/terms-and-conditions.json').toString();
    const parsed = JSON.parse(data);
    if (!parsed.do_you_agree)
        throw new Error(
            'Please read the terms and conditions and modify accordingly under terms-and-conditions.json'
        );
    /* jshint ignore:start */
    import('./startup.mjs');
    /* jshint ignore:end */
} catch (err) {
    console.log(
        `Failed to setup ORP properly. Please run 'npm run orp' in the base directory.`
    );
}
