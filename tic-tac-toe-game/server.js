const net = require('node:net');
const { start } = require('node:repl');
const PORT = 8000;

const users = [];
const board = [
    "_", "_", "_",
    "_", "_", "_",
    "_", "_", "_"
]

let currentTurn = "X";
let gameInProgress = false;

const checkWinner = () => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
        if (board[a] !== '_' && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

const broadcast = (msg) => {
    for (let user of users) {
        user.socket.write(msg);
    }
}

const boardIsFull = () => {
    return board.every((place) => place !== '_');
}

const startNewGame = () => {
    for (let i = 0; i < board.length; i++) {
        board[i] = '_';
    }

    currentTurn = "X";
    gameInProgress = true;

    broadcast(`BOARD|${board}\n`);
    broadcast(`TURN|${currentTurn}\n`);
}

const server = net.createServer((socket) => {
    console.log("Client connected");

    let buffer = '';

    if (users.length === 2) {
        socket.write("There are already 2 players in game please try later\n");
        socket.end();
        return;
    }

    if (users.length === 0) {
        users.push({ name: 'X', socket: socket });
        socket.write("SYMBOL|X\n");
    } else if (users.length === 1) {
        users.push({ name: 'O', socket: socket });
        socket.write("SYMBOL|O\n");

        gameInProgress = true;

        for (const user of users) {
            user.socket.write(`BOARD|${board}\n`);
            user.socket.write("TURN|X\n");
        }
    }

    socket.on('data', (chunk) => {
        buffer += chunk.toString();

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const message = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            if (message === '') {
                continue
            };

            console.log("Recieved", message);

            const [command, place] = message.split("|");

            if (command !== "MOVE") {
                socket.write("INVALID COMMAND\n");
                continue;
            }

            const player = users.find(user => user.socket === socket);

            if (!gameInProgress) {
                socket.write("REJECTED|game not started\n");
                continue;
            }

            if (player.name !== currentTurn) {
                socket.write("REJECTED|not your turn\n");
                continue;
            }

            const cell = Number(place);

            if (!Number.isInteger(cell) || cell > 8 || cell < 0) {
                socket.write("REJECTED|Invalid place\n");
                continue;
            }

            if (board[cell] !== '_') {
                socket.write("REJECTED|the place is already used\n");
                continue;
            }

            board[cell] = player.name;

            const winner = checkWinner();

            broadcast(`BOARD|${board}\n`);

            if (winner) {
                broadcast(`WIN|${winner}\n`);
                startNewGame()
            } else if (boardIsFull()) {
                broadcast(`DRAW\n`);
                startNewGame()
            } else {
                currentTurn = currentTurn === "X" ? "O" : "X";
                broadcast(`TURN|${currentTurn}\n`);
            }
        }
    });

    socket.on('close', () => {
        const index = users.findIndex(user => user.socket === socket);

        if (index !== -1) {
            users.splice(index, 1);
        }

        startNewGame()

        if (users.length === 1) {
            users[0].name = 'X';
            users[0].socket.write("OPPONENT_LEFT\n");
            users[0].socket.write("SYMBOL|X\n");
        }
    });

    socket.on('error', (err) => {
        console.log(err.message);
    })
})


server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
})