const fs = require("fs");
const http = require("http");

class Server {
    constructor(config) {
        this.index = config.index ?? "/index.html";
        this.port = config.port ?? 80;

        this.handlers = new Map();
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
            const body = Buffer.concat(buffer).toString();
            const { headers, method, url } = request;

            this.getHandler(url)(url, method, headers, body, response);
        });
        response.on("error", err => {
            console.error(err);
        });
    }

    defaultHandler(url, method, headers, body, response) {
        if (url === "/") url = this.index;
        url = "." + url;

        fs.readFile(url, (err, data) => {
            if (err) {
                response.statusCode = 404;
                response.end("Invalid addreess");
            } else {
                response.end(data);
            }
        });
    }
}

module.exports = Server;
