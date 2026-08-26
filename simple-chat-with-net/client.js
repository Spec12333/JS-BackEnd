const net = require('node:net');

const PORT = 8000;
const HOSTNAME = '127.0.0.1';

const client = net.createConnection({port : PORT, host : HOSTNAME}, () => {
    console.log("Connected to server");
})

process.stdin.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg === '') {
        return;
    }
    client.write(msg + '\n');
})

client.on('data', (data) => {
    process.stdout.write(data.toString());
});

client.on('end', () => {
    console.log("Client disconnected");
})

client.on('error', (err) => {
    console.log(`${err.message}`);
})