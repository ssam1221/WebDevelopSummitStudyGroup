const Express = require("express");
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

router.use(function (req, res) {
    const result = router.store.delete(req.params.id);

    res.status(resultToStatus(result));
    res.send({
        code: result.code,
    });
});

module.exports = function(store) {
    router.store = store;
    return router;
};
