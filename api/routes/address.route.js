const { route } = require("express/lib/router");
module.exports = (app) => {
  const addressController = require("../controllers/address.controller");

  const router = require("express").Router();

  router.get("/province", addressController.getProvince);
  router.get("/district/:province_id", addressController.getDistrict);
  router.get("/ward/:province_id/:district_id", addressController.getWard);

  app.use("/api/address", router);
};
