import * as TermsAndConditions from '../terms-and-conditions.mjs'; // Terms & Conditions

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
    const data = fs
        .readFileSync('./resources/orp/terms-and-conditions.json')
        .toString();
    const parsed = JSON.parse(data);
    if (!parsed.do_you_agree)
        throw new Error(
            'Please read the terms and conditions and modify accordingly under terms-and-conditions.json'
        );
    import('./startup.mjs');
}
