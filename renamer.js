const fs = require('fs');
const path = require('path');

function parseAllDirectories(previousDirectory, directories) {
    directories.forEach(directory => {
        const newDirectory = path.join(previousDirectory, directory);
        if (fs.lstatSync(newDirectory).isFile() && newDirectory.includes('.js')) {
            fs.renameSync(newDirectory, newDirectory.replace('.js', '.js'));
            return;
        }

        if (fs.lstatSync(newDirectory).isDirectory()) {
            parseAllDirectories(newDirectory, fs.readdirSync(newDirectory));
            return;
        }
    });
}

parseAllDirectories(
    path.join(__dirname, 'resources\\postgres-wrapper'),
    fs.readdirSync(path.join(__dirname, 'resources\\postgres-wrapper'))
);
