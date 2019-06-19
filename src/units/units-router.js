const express = require("express");
const UnitsService = require("./units-service");

const unitsRouter = express.Router();

unitsRouter.route("/").get((req, res, next) => {
  UnitsService.getUnits(req.app.get("db"))
    .then(units => res.json(units))
    .catch(next);
});

module.exports = unitsRouter;
