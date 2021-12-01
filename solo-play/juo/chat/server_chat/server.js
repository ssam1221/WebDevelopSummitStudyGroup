const WebSocket = require("ws");
const Client = require("./client.js");
const MessageHandler = require("./message_handler.js");

class ChatServer {
    constructor(config) {
        this.port = config.port ?? 80;
        this.session = config.session ?? null;

        this.clients = new Map();
    }

    start() {
        this.server = new WebSocket.Server({ port: this.port });

        this.server.on("listening", () => {
            console.log(`WebSocket server is running on ${this.port} port`);
        });

        this.server.on("connection", this.onNewConnection.bind(this));
    }

    onNewConnection(ws, req) {
        this.session(req, {}, () => {
            if (this.isSessionExists(req.session.id)) {
                ws.terminate();
                return;
            }

            const client = new Client(req.session.id, ws);
            client.send({
                method: "PARTICIPANT_UPDATE",
                participants: [...this.clients.values()].map(c => c.profile),
            });

            this.clients.set(req.session.id, client);
            console.log(`Connection opened: ${this.clients.size}`);

            ws.on("message", (data) => this.onMessage(req.session.id, data));
            ws.on("close", () => this.onCloseConnection(req.session.id));
        });
    }

    onMessage(sessionId, data) {
        const client = this.clients.get(sessionId);
        if (!client) {
            console.error(`Client ${sessionId} is not found`);
            return;
        }

        const message = function () {
            try { return JSON.parse(data); }
            catch (e) { return undefined; }
        }();
        if (!message) {
            console.error(`${sessionId}: Invalid message`);
            return;
        }

        console.log(`${sessionId} -> ${message.method}`);
        MessageHandler.get(message.method).handle(this, client, message);
    }

    onCloseConnection(sessionId) {
        const name = this.clients.get(sessionId)?.profile.name;

        this.clients.delete(sessionId);
        console.log(`Connection closed: ${this.clients.size}`);

        if (!name) return;
        this.broadcast({
            method: "PARTICIPANT_LEAVE",
            name: name,
        });
    }

    broadcast(message) {
        this.clients.forEach(c => {
            c.send(message);
        });
    }

    isSessionExists(id) {
        return [...this.clients.values()].find(c => c.sessionId === id);
    }

    isNameExists(name) {
        return [...this.clients.values()].find(c => c.profile.name === name);
    }
}

module.exports = ChatServer;
