const WebServer =require("./web_server.js");

new WebServer({
    root: "web",
    port: 8080,
}).start();
