const client = new Client("ws://localhost:12345/member");

const chat = new Chat(client, {
    input: new ChatInput(
        document.getElementById("chatInputText"),
        document.getElementById("chatSendButton"),
    ),
    log: new ChatLog(
        document.getElementById("chatLog"),
    ),
    participantList: new ParticipantList(
        document.getElementById("participantList"),
    ),
    errorDialog: new ErrorDialog(
        document.getElementById("errorDialog"),
    ),
    nicknameSetDialog: new NicknameSetDialog(
        document.getElementById("nicknameDialog"),
        document.getElementById("nicknameText"),
        document.getElementById("nicknameError"),
        document.getElementById("nicknameConfirmButton"),
    ),
});
chat.start();
