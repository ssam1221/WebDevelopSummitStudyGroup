class Chat {
    constructor(client, elements) {
        this.client = client;
        this.elements = elements;

        this.elements.input.onSendChat = this.onSendChat.bind(this);
        this.elements.input.onSendBinary = this.onSendBinary.bind(this);

        this.elements.nicknameSetDialog.onSet = this.onNicknameChange.bind(this);
    }

    start() {
        this.elements.nicknameSetDialog.show("");
    }

    onSendChat(text) {
        console.log("Send " + text);
    }

    onSendBinary(name, data) {
    }

    onNicknameChange(name) {
        console.log("Nickname changed to " + name);

        this.myProfile = new Profile(name);
        this.elements.participantList.add(name, this.myProfile);
    }
}
