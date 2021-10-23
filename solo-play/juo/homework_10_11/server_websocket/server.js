const WebSocket = require("ws");
const Result = require("./result.js");

class WebSocketServer {
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
            this.clients.set(req.session.id, ws);

            ws.on("close", () => {
                this.clients.delete(req.session.id);
            });
        });
    }

    onNewMember(params) {
        if (params.result === Result.SUCCESS) {
            this.clients.forEach(ws => {
                ws.send(`${params.memberId} is joined!`);
            });
        }
    }

    onSearchMember(params) {
        if (params.result === Result.SUCCESS) {
            this.clients.forEach((ws, sessionId) => {
                if (params.sessionId === sessionId) return;
                ws.send(`${params.memberId} is searched!`);
            });
        }
    }

    onModifyMember(params) {
    }

    onDeleteMember(params) {
        if (params.result === Result.SUCCESS) {
            const ws = this.clients.get(params.sessionId);
            if (!ws) {
                console.error(`${params.sessionId} client doesn't exist`);
                return;
            }

            ws.send(`${params.memberId} is deleted!`);
        }
    }
}

module.exports = WebSocketServer;
