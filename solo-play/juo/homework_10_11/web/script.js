const ws = new WebSocket("ws://localhost:12345/member");

const client = new MemberClient("http://localhost:12344/member");

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
    e.preventDefault();

    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "다 채워...";
            case Result.ALREADY_EXISTS: return "이미 있어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    input = joinInput.get();
    if (!(input.id && input.password && input.nickname)) {
        alert(codeToMessage(Result.INVALID_INPUT));
        return;
    }

    client.request({
        method: "POST",
        data: input,
     }, (status, responseBody) => {
        console.log(status, responseBody);

        if (status === 200) {
            alert("가입함...");
        } else {
            alert(codeToMessage(responseBody?.code));
        }
    });
}

function searchMember(e) {
    e.preventDefault();

    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "아이디 채워...";
            case Result.NOT_FOUND: return "없어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    input = manageInput.get();
    if (!input.id) {
        alert(codeToMessage(Result.INVALID_INPUT));
        return;
    }

    client.request({
        method: "GET",
        resource: input.id,
     }, (status, responseBody) => {
        console.log(status, responseBody);

        if (status === 200) {
            manageInput.set(
                responseBody.member.id,
                responseBody.member.password,
                responseBody.member.nickname);
        } else {
            alert(codeToMessage(responseBody?.code));
        }
    });
}

function modifyMember(e) {
    e.preventDefault();

    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "다 채워...";
            case Result.NOT_FOUND: return "없어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    input = manageInput.get();
    if (!(input.id && input.password && input.nickname)) {
        alert(codeToMessage(Result.INVALID_INPUT));
        return;
    }

    client.request({
        method: "PUT",
        resource: input.id,
        data: input,
     }, (status, responseBody) => {
        console.log(status, responseBody);

        if (status === 200) {
            alert("수정함...");
        } else {
            alert(codeToMessage(responseBody?.code));
        }
    });
}

function deleteMember(e) {
    e.preventDefault();

    function codeToMessage(code) {
        switch (code) {
            case Result.INVALID_INPUT: return "아이디 채워...";
            case Result.NOT_FOUND: return "없어...";
            default: return `에러 코드 ${code}...`;
        }
    }

    input = manageInput.get();
    if (!input.id) {
        alert(codeToMessage(Result.INVALID_INPUT));
        return;
    }

    client.request({
        method: "DELETE",
        resource: input.id,
     }, (status, responseBody) => {
        console.log(status, responseBody);

        if (status === 200) {
            alert("삭제함...");
            manageInput.empty();
        } else {
            alert(codeToMessage(responseBody?.code));
        }
    });
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
