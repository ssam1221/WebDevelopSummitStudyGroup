class Client {
    constructor(url) {
        this.url = url;
    }

    open(listener) {
        this.listener = listener;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            this.listener.onOpen();
        }

        this.socket.onmessage = (event) => {
            this.handleMessage(event.data);
        }

        this.socket.onerror = (event) => {
            this.listener.onDisconnect();
        }

        this.socket.onclose = (event) => {
            this.listener.onDisconnect();
        }
    }

    register(name) {
        this.send({
            method: "REGISTER",
            name: name,
        });
    }

    sendChat(text) {
        this.send({
            method: "CHAT",
            text: text,
        });
    }

    sendBinary(fileName, binary) {
        this.send({
            method: "BINARY",
            fileName: fileName,
            binary: binary,
        });
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }

    handleMessage(data) {
        const message = function () {
            try { return JSON.parse(data); }
            catch (e) { return undefined; }
        }();
        if (!message) {
            console.error(`Invalid message: ${data}`);
            return;
        }
        console.log(message);

        switch (message.method) {
            case "REGISTER_OK":
                this.listener.onRegistered(message.name);
                break;
            case "REGISTER_FAIL":
                this.listener.onRegisterFailed(message.error);
                break;
            case "PARTICIPANT_UPDATE":
                this.listener.onParticipantsUpdate(message.participants);
                break;
            case "PARTICIPANT_JOIN":
                this.listener.onParticipantJoin(message.name, message.picture);
                break;
            case "PARTICIPANT_LEAVE":
                this.listener.onParticipantLeave(message.name);
                break;
            case "CHAT_INCOMING":
                this.listener.onChatIncoming(message.name, message.text, message.time);
                break;
            case "BINARY_INCOMING":
                this.listener.onBinaryIncoming(
                        message.name, message.fileName, message.binary, message.time);
                break;
        }
    }
}
