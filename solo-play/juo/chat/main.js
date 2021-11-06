const WebServer = require("./server_web/server.js");
// const ChatServer = require("./server_chat/server.js");
const Session = require("express-session");

const session = Session({
    secret: "1q2w3e4r",
    resave: false,
    saveUninitialized: true,
})

/*
const chatServer = new ChatServer({
    port: 12345,
    session: session,
});
chatServer.start();
*/

const webServer = new WebServer({
    root: __dirname + "/public",
    port: 8080,
    session: session,
});
webServer.start();
