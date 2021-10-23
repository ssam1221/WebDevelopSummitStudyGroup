const WebSocket = require("ws");
const Result = require("./result.js");

class WebSocketServer {
    constructor(config) {
        this.port = config.port ?? 80;
    }

    start() {
        this.server = new WebSocket.Server({ port: this.port });

        this.server.on("listening", () => {
            console.log(`WebSocket server is running on ${this.port} port`);
        });

        this.server.on("connection", (ws, req) => {
            console.log("new connection\n");
            this.server.clients.forEach(c => { console.log(c) });
        });

        this.server.on("error", (err) => {
            console.log(`err` + err);
        });

        // ws.send('something');
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
