const WebSocket = require("ws");

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
        this.server.on("?", this.onMessage.bind(this));
    }

    onNewConnection(ws, req) {
        this.session(req, {}, () => {
            this.clients.set(req.session.id, ws);

            ws.on("message", (data) => this.onMessage(req.session.id, data));
            ws.on("close", () => this.onCloseConnection(req.session.id));
        });
    }

    onMessage(sessionId, data) {
        console.log(sessionId, data);
    }

    onCloseConnection(sessionId) {
        this.clients.delete(sessionId);
    }
}

module.exports = ChatServer;
