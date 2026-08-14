const fs = require('node:fs/promises');
const path = require('node:path');

const file = process.argv[2] || null;
const fileLimit = 1024;

async function weightCheck(file) {
    try {
        const fileWeight = await fs.stat(file);
        return fileWeight;
    } catch(err) {
        if (err.code === 'ENOENT') {
            console.log("No log file yet at missing.log -- nothing to rotate");
            return;        
        }
    }
    throw err;
}

async function rotator() {
    const fileWeight = await weightCheck(file);
    if (fileWeight.size < fileLimit) {
        console.log(`${fileWeight.size} bytes -- under the limit`);
        return;
    } else {
        const timeStamp = new Date().toISOString();
        let {name, ext} = path.parse(file);
        name = name + timeStamp;
        const finalName = name + ext;
        console.log(finalName);
    }
}

rotator();