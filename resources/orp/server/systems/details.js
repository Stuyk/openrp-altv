import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.js';

const db = new SQL();
export let details;

db.fetchByIds([1], 'Details', res => {
    if (!res) {
        details = { id: 1, mdc: '[]' };
        db.upsertData(details, 'Details', () => {});
        return;
    }

    details = res[0];
});

export function updateField(field, value) {
    details[field] = JSON.stringify(value);
    db.updatePartialData(1, { [field]: details[field] }, 'Details', res => {});
}
