const { off } = require('node:cluster');
const fs = require('node:fs');
const recordCount = 10;

const buffer = Buffer.alloc(7 + recordCount * 9);

buffer.write('SNSR', 0, 'ascii');
buffer.writeUInt8(1, 4);
buffer.writeUInt16BE(10, 5);

let offset = 7;

for (let i = 0; i < recordCount; ++i) {
    buffer.writeUInt32BE(Math.floor(Math.random() * 30) + 1, offset);
    offset += 4;
    buffer.writeFloatBE(Math.floor(Math.random() * 30) + 1, offset);
    offset += 4;
    buffer.writeUInt8(Math.floor(Math.random() * 3) + 1, offset);
    offset += 1;
}

fs.writeFileSync('./records.bin', buffer);

// // while (offset < 97) {
// //     buffer.writeUInt32BE(Math.floor(Math.random() * 30) + 1, offset);
// //     offset += 4;
// //     buffer.writeFloatBE(Math.floor(Math.random() * 30) + 1, offset);
// //     offset += 4;
// //     buffer.writeUInt8(Math.floor(Math.random() * 3) + 1, offset);
// //     offset += 1;
// // }
// while (index < 10) {
//     buffer = Buffer.alloc(9);
//      buffer.writeUInt32BE(Math.floor(Math.random() * 30) + 1, offset);
//      offset += 4;
//      buffer.writeFloatBE(Math.floor(Math.random() * 30) + 1, offset);
//      offset += 4;
//      buffer.writeUInt8(Math.floor(Math.random() * 3) + 1, offset);
//      offset += 1;
//      offset = 0;
//     ++index;
//     fs.writeFileSync('./records.bin', buffer, {flag: 'a'})
// }