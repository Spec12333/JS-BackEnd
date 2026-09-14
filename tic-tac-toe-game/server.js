const net = require('node:net');
const PORT = 8000;

const users = [];
const board = [
    "", "", "",
    "", "", "",
    "", "", ""
]

const broadcast = (currentPlayer, msg) => {
    for (let user of users) {
        if (currentPlayer !== user) {
            user.socket.write(msg);
        }
    }
}

const server = net.createServer((socket) => {
    let buffer = '';
    if (users.length === 2) {
        socket.write("There are already 2 players in game please try later");
        socket.end();
        return;
    }

    if (users.length === 0) {
        users.push({
            name : 'X',
            socket : socket
        });
        socket.write("You are player 1 playing with X type '/quit to quit the game: \n");
    } else if (users.length === 1) {
        users.push({
            name : 'O',
            socket : socket
        });
        socket.write("You are player 2 playing with O type '/quit to quit the game': \n");
    }

    socket.on('close', () => {
        const player = users.find(user => user.socket === socket);
        const index = users.findIndex(user => user.socket === socket);
        if (index !== -1) {
            users.splice(index, 1);
        }
        broadcast(socket, `${player.name} is disconnected`);
    })

    socket.on('error', (err) => {
        console.log(err.message);
    })
})


server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
})