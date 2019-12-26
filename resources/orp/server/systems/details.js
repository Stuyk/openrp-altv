import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.js';

const db = new SQL();
export let details;

async function parseMdc() {
    const mdcData = await db.fetchByIds([1], 'Details');
    if (!mdcData) {
        details = { id: 1, mdc: '[]' };
        await db.upsertData(details, 'Details');
        return;
    }

    details = mdcData[0];
}

export async function updateField(field, value) {
    details[field] = JSON.stringify(value);
    await db.updatePartialData(1, { [field]: details[field] }, 'Details');
}

parseMdc();
