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

const router = Express.Router();

router.use(Express.json());

router.use(function (req, res) {
    const result = router.store.get(req.body.id);

    res.status(resultToStatus(result));
    res.send({
        code: result.code,
        member: result.data,
    });
});

module.exports = function(store) {
    router.store = store;
    return router;
};
