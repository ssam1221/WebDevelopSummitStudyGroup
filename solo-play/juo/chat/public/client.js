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
            this.handleMessage(data);
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

    sendBinary(fileName, data) {
        this.send({
            method: "BINARY",
            fileName: fileName,
            data: data,
        });
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }

    handleMessage(data) {
        console.log(data);

        switch (data.method) {
            case "REGISTER_OK":
                this.listener.onRegistered(data.name);
                break;
            case "REGISTER_FAIL":
                this.listener.onRegisterFailed(data.errorCode);
                break;
            case "PARTICIPANT_UPDATE":
                this.listener.onParticipantsUpdate(data.participants);
                break;
            case "PARTICIPANT_JOIN":
                this.listener.onParticipantJoin(data.participant);
                break;
            case "PARTICIPANT_LEAVE":
                this.listener.onParticipantLeave(data.participant.name);
                break;
            case "CHAT_INCOMING":
                this.listener.onChatIncoming(data.name, data.text, data.time);
                break;
            case "BINARY_INCOMING":
                this.listener.onBinaryIncoming(data.name, data.fileName, data.data, data.time);
                break;
        }
    }
}
