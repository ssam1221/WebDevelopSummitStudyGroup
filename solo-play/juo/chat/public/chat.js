class Chat {
    constructor(client, elements) {
        this.client = client;
        this.elements = elements;

        this.elements.input.onSendChat = this.onSendChat.bind(this);
        this.elements.input.onSendBinary = this.onSendBinary.bind(this);
    }

    start() {
        // TODO: Something wonderful
        this.myProfile = new Profile("juo");
        this.elements.participantList.add("juo", this.myProfile);
        this.elements.participantList.add("초미륵", new Profile("초미륵"));
        this.elements.participantList.add("금부장", new Profile("금부장"));
    }
}
