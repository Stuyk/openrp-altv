import * as alt from 'alt';
import fs from 'fs';

export let Configuration = [];
const path = alt.getResourcePath('orp');
let files = fs.readdirSync(`${path}/server/jobs`);
files = files.filter(x => x.includes('.mjs'));

async function loadJobs() {
    for (let i = 0; i < files.length; i++) {
        let result = await import(`../jobs/${files[i]}`).catch(err => {
            throw err;
        });

        let job = result.job();
        Configuration = Configuration.concat(job);
    }

    import('../systems/job.mjs').then(res => {
        res.load(Configuration);
        console.log(`Loaded: ${Configuration.length} Jobs.`);
    });
}

loadJobs();
