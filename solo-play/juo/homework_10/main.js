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

app.use(function(req, res, next) {
    session = req.session;

    if (session.testValue) {
        console.log("Existing session: " + session.testValue);
    } else {
        const id = Crypto.randomBytes(16).toString("base64");
        session.testValue = id;
        console.log("It's a new session so give a new test value: " + id);
    }

    next();
});

app.use(Express.static(__dirname + "/web"));

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});
