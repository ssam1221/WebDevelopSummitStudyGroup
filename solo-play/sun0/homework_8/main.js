const server = require(`./back/server.js`);

(function() {
    server.start({
        port : 3000
    });
})();