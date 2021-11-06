class Client {
    constructor(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = (event) => {
            // Enable
        }

        this.socket.onmessage = (event) => {
            // interpret event.data
        }

        this.socket.onerror = (event) => {
            // print notification and disable
        }
    }

    sendText(text) {
        // TODO: this.socket.send(text);
    }

    sendFile(data) {
        // TODO:
    }
}
