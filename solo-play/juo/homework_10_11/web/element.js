class MemberFormInput {
    constructor(idElement, passwordElement, nicknameElement) {
        this.idElement = idElement;
        this.passwordElement = passwordElement;
        this.nicknameElement = nicknameElement;
    }

    get() {
        return {
            id: this.idElement.value,
            password: this.passwordElement.value,
            nickname: this.nicknameElement.value,
        }
    }

    set(id, password, nickname) {
        this.idElement.value = id;
        this.passwordElement.value = password;
        this.nicknameElement.value = nickname;
    }

    empty() {
        this.set("", "", "");
    }
}

const joinInput = new MemberFormInput(
    document.getElementById("join_id"),
    document.getElementById("join_password"),
    document.getElementById("join_nickname"),
);

const manageInput = new MemberFormInput(
    document.getElementById("manage_id"),
    document.getElementById("manage_password"),
    document.getElementById("manage_nickname"),
);
