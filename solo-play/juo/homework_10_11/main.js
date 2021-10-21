const MemberServer = require("./server_member/server.js");
const WebServer = require("./server_web/server.js");

new MemberServer({
    path: "member",
    port: 12344,
}).start();

new WebServer({
    root: __dirname + "/web",
    port: 8080,
}).start();
