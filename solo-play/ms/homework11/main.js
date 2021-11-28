const server = require(`./server`);

(function () {
  server.start({
    port: 8080,
  });
})();
