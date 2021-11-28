const { set } = require("store");
const webSocket = require(`ws`);

const MessageTypeEnum = Object.freeze({
  CONNECT: 0,
  ADD: 1,
  SEARCH: 2,
  DELETE: 3,
});

let clients = {};

function start(server) {
  const wss = new webSocket.WebSocketServer({
    server: server,
  });

  wss.on(`connection`, function connection(ws) {
    ws.on(`message`, function incomming(msg) {
      //console.log(`received: ` + msg);
      let message = JSON.parse(msg);
      switch (message.type) {
        case MessageTypeEnum.CONNECT:
          clients[message.id] = ws;
          break;
        case MessageTypeEnum.ADD:
          broadcastToAll(message.data);
          break;
        case MessageTypeEnum.SEARCH:
          broadcastToOthers(message.id, message.data);
          break;
        case MessageTypeEnum.DELETE:
          broadcastToOne(message.id, message.data);
          break;
        default:
          break;
      }
    });
  });
}

/* Broadcast to all */
function broadcastToAll(data) {
  for (let key in clients) {
    clients[key].send(data);
  }
}

/* Broadcast w/o requested client */
function broadcastToOthers(id, data) {
  for (let key in clients) {
    if (key !== id) {
      clients[key].send(data);
    }
  }
}

/* Broadcast to requested client only */
function broadcastToOne(id, data) {
  for (let key in clients) {
    if (key === id) {
      clients[key].send(data);
    }
  }
}

exports.start = start;
