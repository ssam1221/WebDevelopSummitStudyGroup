const Server = require("./server.js");

new Server({
    root: "web",
    port: 8080
}).start();
