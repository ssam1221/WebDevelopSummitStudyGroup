class ChatInput {
    constructor(
        context,
        inputTextElement,
        sendButtonElement,
    ) {
        this.context = context;
        this.inputTextElement = inputTextElement;
        this.sendButtonElement = sendButtonElement;
        this.addEventListeners();
    }

    addEventListeners() {
        this.inputTextElement.addEventListener("keydown", this.onInputTextKeyDown.bind(this));
        this.sendButtonElement.addEventListener("click", this.onSendButtonClick.bind(this));
    }

    sendChat() {
        const text = this.inputTextElement.value;
        if (text.length === 0) return;
        this.inputTextElement.value = "";

        this.context.log.addText(this.context.myProfile, text);
    }

    isModifierSet(e) {
        return e.ctrlKey
            || e.shiftKey
            || e.altKey
            || e.metaKey;
    }

    onSendButtonClick(e) {
        this.sendChat();
    }

    onInputTextKeyDown(e) {
        if (e.key !== "Enter") return;
        if (this.isModifierSet(e)) return;

        e.preventDefault();
        this.sendChat();
    }
}

class ChatLog {
    constructor(context, chatLogElement) {
        this.context = context;
        this.element = chatLogElement;
        this.latestItem = null;
    }

    addText(profile, text) {
        if (this.latestItem === null || this.latestItem.profile !== profile) {
            this.latestItem = new ChatLogItem(this.context, profile);
            this.element.appendChild(this.latestItem.element);
        }

        this.latestItem.addText(text);
        this.element.scrollTop = this.element.scrollHeight;
    }
}

class ChatLogItem {
    constructor(context, profile) {
        this.context = context;
        this.profile = profile;

        const isMyChat = this.profile === this.context.myProfile;

        this.element = this.createItemElement(isMyChat);

        if (!isMyChat) {
            this.profilePictureElement = this.createProfilePictureElement(profile.picture);
            this.element.appendChild(this.profilePictureElement);
        }

        this.textGroupElement = this.createTextGroupElement(isMyChat ? null : profile.name);
        this.element.appendChild(this.textGroupElement);
    }

    addText(text) {
        const textElement = document.createElement("span");
        textElement.className = "chatText";
        textElement.innerText = text;
        this.textGroupElement.appendChild(textElement);

        const brElement = document.createElement("br");
        this.textGroupElement.appendChild(brElement);
    }

    createItemElement(isMyChat) {
        const element = document.createElement("div");
        element.className = (isMyChat ? "chatLogItemSelf" : "chatLogItem");
        return element;
    }

    createProfilePictureElement(picture) {
        const element = document.createElement("img");
        element.className = "chatProfilePicture";
        element.src = picture;
        return element;
    }

    createTextGroupElement(name) {
        const element = document.createElement("div");
        element.className = "chatTextGroup";

        if (name !== null) {
            const nameElement = document.createElement("span");
            nameElement.className = "chatName";
            nameElement.innerText = name;
            element.appendChild(nameElement);

            const brElement = document.createElement("br");
            element.appendChild(brElement);
        }

        return element;
    }
}

class ParticipantList {
    constructor(context, element) {
        this.context = context;
        this.element = element;
        this.participantItems = new Map();
    }

    add(id, profile) {
        this.participantItems.set(
            id,
            new ParticipantItem(this.context, profile));
        this.refresh();
    }

    remove(id) {
        const removed = this.participantItems.delete(id);
        if (!removed) return;
        this.refresh();
    }

    refresh() {
        this.element.textContent = "";

        [...this.participantItems.values()]
            .sort((item1, item2) => item1.profile.name > item2.profile.name)
            .forEach(item => this.element.appendChild(item.element));
    }
}

class ParticipantItem {
    constructor(context, profile) {
        this.context = context;
        this.profile = profile;
        this.element = this.createItemElement(profile);
    }

    createItemElement(profile) {
        const element = document.createElement("div");
        element.className = "participantItem";

        const profilePictureElement = document.createElement("img");
        profilePictureElement.className = "participantProfilePicture";
        profilePictureElement.src = profile.picture;
        element.appendChild(profilePictureElement);

        const isSelfProfile = profile === this.context.myProfile;

        const nameElement = document.createElement("span");
        nameElement.className = isSelfProfile ? "participantNameSelf" : "participantName";
        nameElement.innerText = profile.name;
        element.appendChild(nameElement);

        return element;
    }

    remove() {
        this.element.remove();
    }
}

class Profile {
    constructor(name, picture) {
        this.name = name;
        this.picture = picture ? picture : this.generateDefaultPicture();
    }

    generateDefaultPicture() {
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
        context.fillText(this.name.substr(0, 2), 0, 0);

        return canvas.toDataURL();
    }
}

class Chat {
    constructor() {
        this.input = new ChatInput(
            this,
            document.getElementById("chatInputText"),
            document.getElementById("chatSendButton"),
        );

        this.log = new ChatLog(
            this,
            document.getElementById("chatLog"),
        );

        this.participantList = new ParticipantList(
            this,
            document.getElementById("participantList"),
        );
    }

    start() {
        // TODO: Something wonderful
        this.myProfile = new Profile("juo");
        this.participantList.add("juo", this.myProfile);
        this.participantList.add("초미륵", new Profile("초미륵"));
        this.participantList.add("금부장", new Profile("금부장"));
    }
}

const chat = new Chat();
chat.start();
