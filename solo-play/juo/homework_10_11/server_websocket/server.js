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

    onNewMember(result, id) {
        console.log("new", result, id);
    }

    onSearchMember(result, id) {
        console.log("search", result, id);
    }

    onModifyMember(result, id) {
        console.log("mod", result, id);
    }

    onDeleteMember(result, id) {
        console.log("del", result, id);
    }
}

module.exports = WebSocketServer;
