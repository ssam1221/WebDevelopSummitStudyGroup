const Crypto = require("crypto");
const Express = require("express");
const Session = require("express-session");

const app = Express();
const port = 8080;

app.use(Session({
    secret: "some_secret",
    resave: false,
    saveUninitialized: true
}));
app.use(require("./router/session.js"));

app.use(Express.static(__dirname + "/web"));

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});
