const fs = require('node:fs');
const file = process.argv[2];

const chunk = fs.createReadStream(file);

let bytesProcessed = 0;
let wordCount = 0;
let remainder = '';

chunk.on('data', (data) => {
    bytesProcessed += data.length;
    const text = remainder + data.toString();
    let word = '';
    for (let i = 0; i < text.length; ++i) {
        if (text[i] === ' ' || text[i] === '\t' || text[i] === '\n') {
            ++wordCount;
            word = '';
        } else {
            word += text[i];
        }
    }
    remainder = word;
})

chunk.on('end', () => {
    console.log(`Words: ${bytesProcessed}`);
    console.log(`Bytes processed ${++wordCount}`);
});