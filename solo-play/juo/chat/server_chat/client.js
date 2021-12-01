class Client {
    constructor(sessionId, ws) {
        this.sessionId = sessionId;
        this.ws = ws;
        this.profile = {
            name: undefined,
            picture: undefined,
        }
    }

    send(message) {
        console.log(`${this.sessionId} <- ${message.method}`);
        this.ws.send(JSON.stringify(message));
    }
}

module.exports = Client;
