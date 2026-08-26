# TCP Chat App — README

## 1. Protocol / Framing Design

**Message boundaries:** Newline-delimited framing. Every logical message
(whether typed by a user or sent as a command) must end in `\n`. On the
server, incoming TCP data is appended to a per-socket `buffer` string, and
the code repeatedly looks for `\n` with `buffer.indexOf('\n')`, slicing off
one complete message at a time and leaving any partial message in the
buffer for the next `data` event. This handles both cases raw TCP can throw
at you: multiple messages arriving in a single `data` event (buffer has more
than one `\n`, so the `while` loop drains all of them) and a single message
arriving split across multiple `data` events (no `\n` yet, so the loop exits
and waits for more bytes to append to the buffer). The client writes
`msg + '\n'` for the same reason, so both sides agree on the delimiter.

**Message-type convention:** A message is classified by its first token:
- No leading `/` → broadcast message.
- `/msg <username> <message...>` → direct message to one user.
- `/who` → request for the list of connected users.
- `/quit` → graceful disconnect.

Anything else falls through to the broadcast branch, so it's a simple,
consistent rule: `/` prefix means "command", everything else is a public
message to the room.

**DM syntax:** `/msg <username> <message>`, e.g. `/msg bob hello there`.
The message body is everything after the first two space-separated tokens
(`userData.slice(2).join(' ')`), so the DM text itself can contain spaces
freely.

## 2. Additional Features Implemented

1. **`/who` — list connected users.** The server iterates its in-memory
   `users` array and writes each connected username back to the requester.
2. **`/quit` — graceful exit with leave notification.** When a client sends
   `/quit`, the server broadcasts `*** <username> left the chat ***` to
   everyone else and then closes that socket with `socket.end()`.

Beyond the two picked features, the app also meets all core requirements:
username prompt on connect, duplicate-username rejection with a retry
prompt, broadcast to everyone except the sender, DMs with sender-side
confirmation (`[you -> bob]: ...`) and a visually distinct recipient-side
tag (`[DM from alice]: ...`), and per-socket `error`/`close` handlers so one
client's abrupt disconnect (or any socket error) just removes that user
from the `users` list and logs it server-side, without affecting anyone
else's connection.

## 3. How to Run It

1. Start the server (only needs to run once):
   ```
   node server.js
   ```
   It listens on port `8000` and prints `Server is listening on port 8000`.

2. In a separate terminal for each participant, start a client:
   ```
   node client.js
   ```
   Each client connects to `127.0.0.1:8000`.

3. When prompted, type a username and press Enter. If it's already taken,
   you'll be asked to try another one.

4. Once registered:
   - Type any plain text + Enter to broadcast it to everyone else.
   - Type `/msg <username> <message>` to send a private DM.
   - Type `/who` to see everyone currently connected.
   - Type `/quit` to leave gracefully (everyone else is notified).
   - Closing the terminal window / Ctrl+C also disconnects you cleanly;
     other clients are unaffected.
