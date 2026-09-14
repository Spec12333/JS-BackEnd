const net = require('node:net');

const PORT = 8000;

const client = net.createConnection({port : PORT}, () => {
    console.log("Connected to Server");
})



client.on('data', (data) => {
    process.stdout.write(data.toString());
})

client.on('end', ()=> {
    console.log("Disconnected from server");
})

client.on('error', (err) => {
    console.log(err.message);
})