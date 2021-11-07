class Profile {
    constructor(id, name, picture) {
        this.id = id;
        this.name = name;
        this.picture = picture;
    }
}

class Chat {
    constructor(client, elements) {
        this.client = client;
        this.elements = elements;
        this.registerHandlers();

        this.id = "myself_temp";    // TODO:
    }

    registerHandlers() {
        this.elements.input.onSendChat = this.onSendChat.bind(this);
        this.elements.input.onSendBinary = this.onSendBinary.bind(this);

        this.elements.nicknameSetDialog.onSet = this.onNicknameChange.bind(this);
    }

    start() {
        this.elements.nicknameSetDialog.show("");
    }

    onSubmitChat(text) {
        // TODO: send text to server
        this.elements.log.addText(new Profile(this.id, this.id, null), text, new Date(), false);
    }

    onSubmitBinary(name, data) {
    }

    onNicknameChange(name) {
        console.log("Nickname changed to " + name);

        // TODO: register me to server
        const id = this.id;
        this.elements.participantList.add(id, name, null, id === this.id);
    }
}
