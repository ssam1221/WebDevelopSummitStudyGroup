const Express = require("express");
const Member = require("../store/member.js");
const Result = require("../store/result.js");

function resultToStatus(result) {
    switch (result.code) {
        case Result.SUCCESS:
            return 200;
        case Result.INVALID_INPUT:
            return 400;
        case Result.NOT_FOUND:
            return 404;
        default:
            console.error("Unhandled error " + result);
            return 500;
    }
}

const router = Express.Router({ mergeParams: true });

router.use(Express.json());

router.use(function (req, res) {
    const result = router.store.modify(req.params.id, new Member(req.body));

    res.status(resultToStatus(result));
    res.send({
        code: result.code,
    });

    router.listeners.forEach(l => l.onModifyMember(result.code, req.params.id));
});

module.exports = function(options) {
    router.store = options.store;
    router.listeners = options.listeners;
    return router;
};
