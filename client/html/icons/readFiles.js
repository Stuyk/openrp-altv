const fs = require('fs');

const files = [];
fs.readdirSync('./').forEach(file => {
    if (!file.includes('svg')) return;

    files.push(file);
});

console.log(JSON.stringify(files));
