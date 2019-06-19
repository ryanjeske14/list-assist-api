const UnitsService = {
  getUnits(db) {
    return db.from("units").select("*");
  }
};

module.exports = UnitsService;
