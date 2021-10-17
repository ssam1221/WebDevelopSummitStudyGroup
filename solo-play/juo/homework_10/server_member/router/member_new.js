const Express = require("express");

const router = Express.Router();

router.use(Express.json());

router.use(function (req, res, next) {
    console.log(req.body)
    next();
});

module.exports = function(store) {
    router.store = store;
    return router;
};
