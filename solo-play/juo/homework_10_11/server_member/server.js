const Cors = require("cors");
const Express = require("express");
const MemberStore = require("./store/store.js");

class MemberServer {
    constructor(config) {
        this.app = Express();
        this.store = new MemberStore();
        this.listeners = [];

        this.path = "/" + config.path;
        this.port = config.port ?? 80;
        this.session = config.session ?? null;
    }

    initRouters() {
        this.app.use(Cors({
            origin: true,
            credentials: true,
        }));

        if (this.session) {
            this.app.use(this.session);
        }

        const options = {
            store: this.store,
            listeners: this.listeners
        };

        this.app.route(this.path)
            .post(require("./router/member_new.js")(options))

        this.app.route(this.path + "/:id")
            .get(require("./router/member_search.js")(options))
            .put(require("./router/member_modify.js")(options))
            .delete(require("./router/member_delete.js")(options));
    }

    start() {
        this.initRouters();

        this.app.listen(this.port, () => {
            console.log(`Member server is running on ${this.port} port`);
        });
    }

    registerListener(listener) {
        this.listeners.push(listener);
    }

    unregisterListener(listener) {
        const i = this.listeners.indexOf(listener);
        if (i < 0) return;

        this.listeners.splice(i, 1)
    }
}

module.exports = MemberServer;
