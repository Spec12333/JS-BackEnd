const fs = require('node:fs');
const inputPath = process.argv[2] || 0;
const shiftPath = +process.argv[3] || 0;

const caeserShift = (input, shiftCount) => {
    const buffer = Buffer.alloc(input.length);

    for (let i = 0; i < input.length; ++i) {
        const byte = input[i];

        if (byte >= 65 && byte <= 90) {
            buffer[i] = ((byte - 65 + shiftCount) % 26) + 65;
        } else if (byte >= 97 && byte <= 122) {
            buffer[i] = ((byte + 97 + shiftCount) % 26) + 97;
        } else {
            buffer[i] = byte;
        }
    }
    return buffer;
}
const read = fs.readFileSync(inputPath);
const encoded = caeserShift(read, shiftPath);
fs.writeFileSync('encoded.txt', encoded, 'utf-8');
console.log(read.toString());
console.log(encoded.toString())