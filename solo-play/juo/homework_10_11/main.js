const WebSocketServer = require("./server_websocket/server.js");
const MemberServer = require("./server_member/server.js");
const WebServer = require("./server_web/server.js");
const Session = require("express-session");

const session = Session({
    secret: "1q2w3e4r",
    resave: false,
    saveUninitialized: true,
})

const wsServer = new WebSocketServer({
    port: 12345,
    session: session,
});
wsServer.start();

const memberServer = new MemberServer({
    path: "member",
    port: 12344,
    session: session,
});
memberServer.registerListener(wsServer);
memberServer.start();

const webServer = new WebServer({
    root: __dirname + "/web",
    port: 8080,
    session: session,
});
webServer.start();
