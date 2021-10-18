const Cors = require("cors");
const Express = require("express");
const MemberStore = require("./store/store.js");

class MemberServer {
    constructor(config) {
        this.app = Express();
        this.store = new MemberStore();

        this.path = "/" + config.path;
        this.port = config.port ?? 80;
    }

    initRouters() {
        this.app.use(Cors());

        this.app.route(this.path)
            .post(require("./router/member_new.js")(this.store))

        this.app.route(this.path + "/:id")
            .get(require("./router/member_search.js")(this.store))
            .put(require("./router/member_modify.js")(this.store))
            .delete(require("./router/member_delete.js")(this.store));
    }

    start() {
        this.initRouters();

        this.app.listen(this.port, () => {
            console.log(`Member server is running on ${this.port} port`);
        });
    }
}

module.exports = MemberServer;
