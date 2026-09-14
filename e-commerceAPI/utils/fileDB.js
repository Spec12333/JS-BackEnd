const fs = require('node:fs/promises');
const path = require('node:path');

async function readData(file) {
    const filePath = path.join(__dirname, '..' , 'data' , file);
    const rawData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawData || '[]');
}

async function writeData(file, data) {
    const filePath = path.join(__dirname, '..', 'data', file);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {readData, writeData};