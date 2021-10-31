module.exports = app => {
    const demographicsController = require("../controllers/demographics.controller")

    const router = require("express").Router()

    router.post("/", demographicsController.create);

    app.use("/api/demographics", router);
}
