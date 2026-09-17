const net = require('node:net');

const PORT = 8000;

let buffer = '';

const client = net.createConnection({ port: PORT }, () => {
    console.log("Connected to Server");
})

const printBoard = (boardStr) => {
    const cells = boardStr.split(',').map((cell) => (cell === '_' ? '.' : cell));
    console.log(` ${cells[0]} | ${cells[1]} | ${cells[2]} `);
    console.log('-----------');
    console.log(` ${cells[3]} | ${cells[4]} | ${cells[5]} `);
    console.log('-----------');
    console.log(` ${cells[6]} | ${cells[7]} | ${cells[8]} `);
}

client.on('data', (chunk) => {
    buffer += chunk.toString();

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (line === '') continue;

        const [command, arg] = line.split('|');

        if (command === 'BOARD') {
            printBoard(arg);
        } else {
            console.log(line);
        }
    }
})

process.stdin.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg === '') {
        return;
    }
    client.write(msg + '\n');
})

client.on('end', () => {
    console.log("Disconnected from server");
})

client.on('error', (err) => {
    console.log(err.message);
})