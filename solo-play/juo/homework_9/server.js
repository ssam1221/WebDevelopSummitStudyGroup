const fs = require("fs");
const http = require("http");
const Cookie = require("./cookie.js");
const Session = require("./session.js");
const SessionManager = require("./sessionmanager.js");

class Server {
    constructor(config) {
        this.root = config.root ?? ".";
        this.index = config.index ?? "index.html";
        this.port = config.port ?? 80;

        this.handlers = new Map();
        this.sessionManager = new SessionManager();
        this.server = http.createServer(this.onRequestIncoming.bind(this));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on ${this.port} port`);
        });
    }

    stop() {
        this.server.close(() => {
            console.log(`Server is closed`);
        });
    }

    setHandler(url, handler) {
        this.handlers.set(url, handler);
    }

    getHandler(url) {
        const handler = this.handlers.get(url) ?? this.defaultHandler;
        return handler.bind(this);
    }

    onRequestIncoming(request, response) {
        const buffer = [];

        request.on("error", err => {
            console.error(err);
        }).on("data", chunk => {
            buffer.push(chunk);
        }).on("end", () => {
            const requestParam = {
                url: this.refineUrl(request.url),
                method: request.method,
                headers: request.headers,
                body: Buffer.concat(buffer).toString(),
            }

            this.getHandler(request.url)(requestParam, response);
        });
        response.on("error", err => {
            console.error(err);
        });
    }

    refineUrl(url) {
        if (url === "/") url += this.index;
        return this.root + url;
    }

    defaultHandler(request, response) {
        const cookie = Cookie.from(request.headers.cookie);
        const session = this.sessionManager.getSession(cookie.get(Session.COOKIE_ID));
        if (session) {
            console.log(`Request comes in session ${session.id}`);
        } else {
            const newSession = this.sessionManager.createSession();
            response.setHeader("Set-Cookie", newSession.toCookie());
        }

        fs.readFile(request.url, (err, data) => {
            if (err) {
                this.respondWithError(response, 404);
            } else {
                response.end(data);
            }
        });
    }

    respondWithError(response, code) {
        response.statusCode = code;
        response.end(`Error: ${code}`);
    }
}

module.exports = Server;
