const Express = require("express");
const Session = require("express-session");

class WebServer {
    constructor(config) {
        this.app = Express();

        this.root = config.root ?? "";
        this.port = config.port ?? 80;
    }

    initRouters() {
        this.app.use(Session({
            secret: "some_secret",
            resave: false,
            saveUninitialized: true,
        }));
        this.app.use(require("./router/session.js"));

        this.app.use(Express.static(this.root));
    }

    start() {
        this.initRouters();

        this.app.listen(this.port, () => {
            console.log(`Web server is running on ${this.port} port`);
        });
    }
}

module.exports = WebServer;
