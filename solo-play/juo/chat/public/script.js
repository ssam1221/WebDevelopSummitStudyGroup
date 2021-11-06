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
});
chat.start();
