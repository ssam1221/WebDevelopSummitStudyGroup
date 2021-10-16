const Cookie = require("./cookie.js");

class Session {
    constructor(id) {
        this.id = id;
    }

    toCookie() {
        const cookie = new Cookie();
        cookie.set(Session.COOKIE_ID, this.id);

        return cookie.parameterize();
    }
}

Session.COOKIE_ID = "session_id";

module.exports = Session;
