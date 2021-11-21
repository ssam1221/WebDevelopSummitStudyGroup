class ChatInput {
    constructor(
        inputTextElement,
        sendButtonElement,
    ) {
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

        if (this.onSubmitChat) this.onSubmitChat(text);
    }

    sendBinary() {
        // TODO: reset input

        if (this.onSubmitBinary) this.onSubmitBinary("fileName", "binary");
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
    constructor(chatLogElement) {
        this.element = chatLogElement;
    }

    addText(profile, text, date, isSelf) {
        if (this.isNameChanged(profile.name)) {
            this.latestItem = new ChatLogItem(profile, isSelf);
            this.element.appendChild(this.latestItem.element);
        }

        this.latestItem.addText(text, date);
        this.element.scrollTop = this.element.scrollHeight;
    }

    isNameChanged(name) {
        return (!this.latestItem || this.latestItem.name !== name);
    }
}

class ChatLogItem {
    constructor(profile, isSelf) {
        this.name = profile.name;
        this.element = this.createItemElement(isSelf);

        this.profilePictureElement = this.createProfilePictureElement(profile.picture);
        this.element.appendChild(this.profilePictureElement);

        this.textGroupElement = this.createTextGroupElement(profile.name);
        this.element.appendChild(this.textGroupElement);
    }

    addText(text, date) {
        const textLineElement = document.createElement("div");
        textLineElement.className = "chatTextLine";
        this.textGroupElement.appendChild(textLineElement);

        const textElement = document.createElement("span");
        textElement.className = "chatText";
        textElement.innerText = text;
        textLineElement.appendChild(textElement);

        const oldTimeElement = this.textGroupElement.getElementsByClassName("chatTime")[0];
        if (oldTimeElement) oldTimeElement.remove();

        const timeElement = document.createElement("span");
        timeElement.className = "chatTime";
        timeElement.innerText = this.formatTimeString(date);
        textLineElement.appendChild(timeElement);

        const brElement = document.createElement("br");
        textLineElement.appendChild(brElement);
    }

    createItemElement(isSelf) {
        const element = document.createElement("div");
        element.className = (isSelf ? "chatLogItemSelf" : "chatLogItem");
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

        const nameElement = document.createElement("div");
        nameElement.className = "chatName";
        nameElement.innerText = name;
        element.appendChild(nameElement);

        return element;
    }

    formatTimeString(date) {
        const meridiem = (date.getHours() < 12) ? "오전" : "오후";

        let hours = date.getHours() % 12;
        if (hours === 0) hours = 12;

        let minutes = date.getMinutes();
        if (minutes < 10) minutes = "0" + minutes;

        return `${meridiem} ${hours}:${minutes}`;
    }
}

class ParticipantList {
    constructor(element) {
        this.element = element;
        this.participantItems = new Map();
    }

    get(name) {
        const item = this.participantItems.get(name);
        if (!item) return null;

        return {
            name: item.name,
            picture: item.picture,
        };
    }

    add(profile, isSelf) {
        this.participantItems.set(
            profile.name,
            new ParticipantItem(profile, isSelf));
        this.refresh();
    }

    remove(name) {
        const removed = this.participantItems.delete(name);
        if (!removed) return;
        this.refresh();
    }

    empty() {
        this.participantItems.clear();
    }

    refresh() {
        this.element.textContent = "";

        [...this.participantItems.values()]
            .sort((item1, item2) => item1.profile.name > item2.profile.name)
            .forEach(item => this.element.appendChild(item.element));
    }
}

class ParticipantItem {
    constructor(profile, isSelf) {
        this.name = profile.name;
        this.picture = profile.picture;
        this.element = this.createItemElement(profile.name, profile.picture, isSelf);
    }

    createItemElement(name, picture, isSelf) {
        const element = document.createElement("div");
        element.className = "participantItem";

        const profilePictureElement = document.createElement("img");
        profilePictureElement.className = "participantProfilePicture";
        profilePictureElement.src = picture;
        element.appendChild(profilePictureElement);

        const nameElement = document.createElement("span");
        nameElement.className = isSelf ? "participantNameSelf" : "participantName";
        nameElement.innerText = name;
        element.appendChild(nameElement);

        return element;
    }
}

class ErrorDialog {
    constructor(dialogElement) {
        this.element = dialogElement;
    }

    show() {
        this.element.style.visibility = "visible";
    }

    hide() {
        this.element.style.visibility = "hidden";
    }
}

class NicknameSetDialog {
    constructor(dialogElement, inputElement, errorElement, confirmButtonElement) {
        this.element = dialogElement;
        this.inputElement = inputElement;
        this.errorElement = errorElement;
        this.confirmButtonElement = confirmButtonElement;

        this.confirmButtonElement.addEventListener(
            "click", this.onConfirmButtonClick.bind(this));
    }

    show(name) {
        this.inputElement.value = name;
        this.element.style.visibility = "visible";

        this.inputElement.focus();
    }

    hide() {
        this.element.style.visibility = "hidden";
    }

    error(text) {
        if (!text || text.length === 0) text = "&nbsp;";
        this.errorElement.innerHTML = text;
    }

    onConfirmButtonClick(e) {
        this.inputElement.value = this.inputElement.value.trim();
        const newName = this.inputElement.value;
        if (newName.length <= 0) {
            this.inputElement.focus();
            return;
        }

        if (this.onSet) this.onSet(newName);
    }
}
