const Express = require("express");
const Member = require("../store/member.js");
const Result = require("../store/result.js");

function resultToStatus(result) {
    switch (result.code) {
        case Result.SUCCESS:
            return 200;
        case Result.ALREADY_EXISTS:
            return 400;
        case Result.INVALID_INPUT:
            return 400;
        default:
            console.error("Unhandled error " + result);
            return 500;
    }
}

const router = Express.Router();

router.use(Express.json());

router.use(function (req, res) {
    const result = router.store.add(new Member(req.body));

    res.status(resultToStatus(result));
    res.send({
        code: result.code,
    });

    router.listeners.forEach(l => l.onNewMember({
        sessionId: req.session.id,
        memberId: req.body.id,
        result: result.code,
    }));
});

module.exports = function(options) {
    router.store = options.store;
    router.listeners = options.listeners;
    return router;
};
