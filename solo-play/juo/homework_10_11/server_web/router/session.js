const Express = require("express");
const Crypto = require("crypto");

const router = Express.Router();

router.use(function (req, res, next) {
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

module.exports = router;
