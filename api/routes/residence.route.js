module.exports = app => {
    const residenceController = require("../controllers/residence.controller")

    const router = require("express").Router()

    router.post("/", residenceController.create);
    router.get("/", residenceController.getAll);

    app.use("/api/residence", router);
}
