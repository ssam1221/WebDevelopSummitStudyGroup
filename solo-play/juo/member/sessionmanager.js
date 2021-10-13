const crypto = require("crypto");
const Session = require("./session.js");

class SessionManager {
    constructor() {
        this.sessions = new Map();
    }

    getSession(id) {
        return this.sessions.get(id);
    }

    createSession() {
        const id = this.generateId();
        const session = new Session(id);
        this.sessions.set(id, session);
        return session;
    }

    generateId() {
        return crypto.randomBytes(16).toString("base64");
    }
}

module.exports = SessionManager;
