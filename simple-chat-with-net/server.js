const net = require('node:net');
const PORT = 8000;
const users = [];

const broadcast = (message, currentClient) => {
    for (const user of users) {
        if (user.socket !== currentClient) {
            user.socket.write(message);
        }
    }
}

const server = net.createServer((socket) => {
    console.log("New client connected");
    socket.write("Please Enter your username: \n");
    let userName = "";
    let buffer = "";

    socket.on('data', (data) => {
        buffer += data.toString();
        let newLineIndex;

        while ((newLineIndex = buffer.indexOf('\n')) !== -1) {
            const message = buffer.slice(0, newLineIndex);
            buffer = buffer.slice(newLineIndex + 1);

            //Registration phase
            if (userName === "") {
                if (users.find(user => user.username === message)) {
                    socket.write("The name is already taken try another one: \n");
                    continue;
                } else {
                    userName = message;

                    users.push({
                        username : userName,
                        socket : socket
                    });

                    socket.write("Username is accepted \n");
                    console.log(`${userName} joined the chat`);
                    broadcast(`${userName} joined the chat\n`, socket);
                    continue;
                }
            }

            //Direct Message
            if (message.startsWith("/msg")) {
                const userData = message.split(' ');
                const receiverName = userData[1];
                const receiver = users.find(user => user.username === receiverName);
                const msg = userData.slice(2).join(' ');

                if (!receiver) {
                    socket.write(`User ${receiverName} is neither connected nor registered \n`);
                    continue;
                } else {
                    receiver.socket.write(`[DM from ${userName}]: ${msg}\n`);
                    socket.write(`[you -> ${receiver.username}]: ${msg}\n`);
                    continue;
                }
            }

            //Lists all active users
            if (message === "/who"){
                for (let user of users) {
                    socket.write(`${user.username}\n`);
                }
                continue;
            }

            //Quits chat
            if (message.startsWith("/quit")) {
                broadcast(`*** ${userName} left the chat ***\n`, socket);
                socket.end();
                continue;
            }

            //Sends message to everyone
            broadcast(`[${userName}]: ${message}\n`,socket);
       }
    });

    socket.on('close', () => {
        const index = users.findIndex(user => user.username === userName);

        if (index !== -1) {
            users.splice(index, 1);
        }
        console.log(`${userName} disconnected from Server`);
        
    });

    socket.on('error', (err) => {
        console.log(`${err.message}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});