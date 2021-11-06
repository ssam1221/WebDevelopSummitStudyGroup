const Express = require("express");

class WebServer {
    constructor(config) {
        this.app = Express();

        this.root = config.root ?? "";
        this.port = config.port ?? 80;
        this.session = config.session ?? null;
    }

    initRouters() {
        if (this.session) {
            this.app.use(this.session);
        }

        this.app.use(Express.static(this.root, { fallthrough: false }));
        this.app.use((err, req, res, next) => {
            res.sendFile(this.root + "/404.html");
        });
    }

    start() {
        this.initRouters();

        this.app.listen(this.port, () => {
            console.log(`Web server is running on ${this.port} port`);
        });
    }
}

module.exports = WebServer;
