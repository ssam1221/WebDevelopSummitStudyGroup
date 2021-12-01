class Profile {
    constructor(name, picture) {
        this.name = name;
        this.picture = picture;
    }

    static generateDefaultPicture(name) {
        function getRandomNumber(min, max) {
            return Math.random() * (max - min) + min;
        }

        function getRandomBackgroundColor() {
            const r = Math.random() * 180;
            const g = Math.random() * 180;
            const b = Math.random() * 180;
            return `rgb(${r}, ${g}, ${b})`;
        }

        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 500;

        const context = canvas.getContext("2d");

        context.fillStyle = getRandomBackgroundColor();
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.translate(
            canvas.width / 2,
            canvas.height / 2);
        context.rotate(getRandomNumber(-0.2, 0.2));
        context.font = "320px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";
        context.fillText(name.substr(0, 2), 0, 0);

        return canvas.toDataURL();
    }
}

class Chat {
    constructor(client, elements) {
        this.client = client;
        this.elements = elements;
        this.myName = null;
        this.registerUiHandlers(elements);
    }

    registerUiHandlers(elements) {
        elements.input.onSubmitChat = this.onSubmitChat.bind(this);
        elements.input.onSubmitBinary = this.onSubmitBinary.bind(this);

        elements.nicknameSetDialog.onSet = this.onNicknameChange.bind(this);
    }

    start() {
        this.client.open(this);
    }

    onSubmitChat(text) {
        this.client.sendChat(text);
    }

    onSubmitBinary(fileName, binary) {
        this.client.sendBinary(fileName, binary);
    }

    onNicknameChange(name) {
        this.client.register(name);
    }

    onOpen() {
        this.elements.nicknameSetDialog.show("");
    }

    onDisconnect() {
        this.elements.errorDialog.show();
        this.elements.nicknameSetDialog.hide();
    }

    onRegistered(name) {
        this.myName = name;
        this.elements.nicknameSetDialog.hide();
    }

    onRegisterFailed(error) {
        this.elements.nicknameSetDialog.error(error);
    }

    onParticipantsUpdate(participants) {
        this.elements.participantList.empty();

        participants.forEach(e => {
            if (!e.name) return;
            if (!e.picture) e.picture = Profile.generateDefaultPicture(e.name);

            this.elements.participantList.add(e, e.name === this.myName);
        });
    }

    onParticipantJoin(name, picture) {
        const profile = new Profile(
            name,
            picture ? picture : Profile.generateDefaultPicture(name)
        );
        this.elements.participantList.add(profile, name === this.myName);
    }

    onParticipantLeave(name) {
        this.elements.participantList.remove(name);
    }

    onChatIncoming(name, text, time) {
        this.elements.log.addText(
            this.elements.participantList.get(name),
            text,
            new Date(time),
            name === this.myName);
    }

    onBinaryIncoming(name, fileName, binary, time) {
        // TODO:
    }
}
