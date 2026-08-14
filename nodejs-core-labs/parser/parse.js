const fs = require('node:fs');
const file = fs.readFileSync('./records.bin');

const magic = file.toString('ascii', 0, 4);
if (magic !== 'SNSR') {
    throw new Error("The magic word is not compatible");
}

const version = file.readUInt8(4);
if (version !== 1) {
    throw new Error("The version is not compatible");
}

const recordCount = file.readUint16BE(5);

let offset = 7;
let record = [];


for (let i = 0; i < recordCount; ++i) {
    let timestamp = file.readUint32BE(offset);
    let temperature = file.readFloatBE(offset + 4);
    let sensorId = file.readUInt8(offset + 8);
    record.push({
        timestamp : new Date(timestamp * 1000),
        temperature,
        sensorId
    }),
    offset += 9;
}

let tempSum = 0;
for (let i = 0; i < record.length; ++i) {
    tempSum += record[i].temperature;
}
let avgTemp = tempSum / record.length;

const sensorCounts = {};
for (let i = 0; i < record.length; i++) {
    const id = record[i].sensorId;
    sensorCounts[id] = (sensorCounts[id] || 0) + 1;
}

let mostCommonSensor = null;
let maxCount = 0;
for (const sensorId in sensorCounts) {
    if (sensorCounts[sensorId] > maxCount) {
        maxCount = sensorCounts[sensorId];
        mostCommonSensor = sensorId;
    }
}

console.log("File format valid (SNSR v1)");
console.log(`Records passed: ${recordCount}`);
console.log(`Average temperature: ${avgTemp.toFixed(2)}°C`);
console.log(`Most active sensor: #${mostCommonSensor} (${maxCount} readings)`);