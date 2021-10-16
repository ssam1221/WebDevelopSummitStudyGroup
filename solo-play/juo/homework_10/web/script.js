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

function createMember(e) {
    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "다 채워...";
            case Result.ALREADY_EXISTS: return "이미 있어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    const result = manager.add(new Member(joinInput.get()));

    if (result.isSuccess()) {
        alert("가입함...");
        joinInput.empty();
    } else {
        alert(codeToMessage(result.code));
    }

    e.preventDefault();
}

function searchMember(e) {
    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "아이디 채워...";
            case Result.NOT_FOUND: return "없어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    const result = manager.get(manageInput.get().id);

    if (result.isSuccess()) {
        const found = result.data;
        manageInput.set(found.id, found.password, found.nickname);
    } else {
        alert(codeToMessage(result.code));
    }

    e.preventDefault();
}

function modifyMember(e) {
    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "다 채워...";
            case Result.NOT_FOUND: return "없어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    const input = manageInput.get();
    const result = manager.modify(input.id, new Member(input));

    if (result.isSuccess()) {
        alert("수정함...");
    } else {
        alert(codeToMessage(result.code));
    }

    e.preventDefault();
}

function deleteMember(e) {
    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "아이디 채워...";
            case Result.NOT_FOUND: return "없어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    const input = manageInput.get();
    const result = manager.delete(input.id);

    if (result.isSuccess()) {
        alert("삭제함...");
        manageInput.empty();
    } else {
        alert(codeToMessage(result.code));
    }

    e.preventDefault();
}

function registerEventListeners() {
    document.getElementById("join_create").addEventListener("click", createMember);
    document.getElementById("manage_search").addEventListener("click", searchMember);
    document.getElementById("manage_modify").addEventListener("click", modifyMember);
    document.getElementById("manage_delete").addEventListener("click", deleteMember);
}

registerEventListeners();

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

const manager = new MemberManager();
