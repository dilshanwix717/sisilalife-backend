const express = require("express");
const {logger} = require("../utils/logger");
const {CheckAuth} = require("../middleware/check-auth");
const router = express.Router();

const adsController = require("../controllers/adsController");

router.post("/getAdsForTheCountry", logger, CheckAuth, adsController.getAdsForTheCountry);

module.exports = router;
