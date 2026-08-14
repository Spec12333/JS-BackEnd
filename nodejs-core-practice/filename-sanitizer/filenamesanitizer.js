const path = require('node:path');
const fs = require('node:fs');

function sanitizer(fileName) {
    const {name, ext} = path.parse(fileName);

    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const cleanExt = ext.toLowerCase();

    return cleanName + cleanExt;
}

const directory = fs.readdirSync('./messy');
fs.mkdirSync('./organized', {recursive: true});

for (let file of directory) {
    let cleanedFile = sanitizer(file);
    
    console.log(cleanedFile);
    let currDir = path.join('./messy', file);
    let newDir = path.join('./organized', cleanedFile);
    fs.copyFileSync(currDir, newDir);
}