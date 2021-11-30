class MessageHandler {
    static get(method) {
        switch (method) {
            case "REGISTER": return new RegisterMessageHandler();
            case "CHAT": return new ChatMessageHandler();
            case "BINARY": return new BinaryMessageHandler();
            default: return new InvalidMessageHandler(method);
        }
    }
}

class RegisterMessageHandler {
    handle(server, client, data) {
        const refinedName = this.refineName(data.name);
        if (!refinedName) {
            client.send(this.getFailMessage("닉네임이 올바르지 않습니다."));
            return;
        }
        if (server.isNameExists(refinedName)) {
            client.send(this.getFailMessage("중복된 닉네임입니다."));
            return;
        }

        client.profile.name = refinedName;
        client.profile.picture = data.picture;

        client.send({
            method: "REGISTER_OK",
            name: client.profile.name,
        });

        server.broadcast({
            method: "PARTICIPANT_JOIN",
            name: client.profile.name,
            picture: client.profile.picture,
        });
    }

    getFailMessage(error) {
        return {
            method: "REGISTER_FAIL",
            error: error,
        };
    }

    refineName(name) {
        const trimmedName = name.trim();
        return (trimmedName.length > 0) ? trimmedName : undefined;
    }
}

class ChatMessageHandler {
    handle(server, client, data) {
        server.broadcast({
            method: "CHAT_INCOMING",
            name: client.profile.name,
            text: data.text,
            time: Date.now(),
        });
    }
}

class BinaryMessageHandler {
    handle(server, client, data) {
        server.broadcast({
            method: "BINARY_INCOMING",
            name: client.profile.name,
            fileName: data.fileName,
            binary: data.binary,
            time: Date.now(),
        });
    }
}

class InvalidMessageHandler {
    constructor(method) {
        this.method = method;
    }

    handle() {
        console.error(`Unknown message: ${this.method}`);
    }
}

module.exports = MessageHandler;
