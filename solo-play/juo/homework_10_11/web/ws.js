const socket = new WebSocket("ws://localhost:12345/member");

socket.onmessage = function(event) {
    console.log("WS message: " + event.data);
}
