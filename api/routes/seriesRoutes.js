const express = require("express");
const {logger} = require("../utils/logger");
const {CheckAuth} = require("../middleware/check-auth");
const router = express.Router();

const SeriesController = require("../controllers/seriesController");

router.post("/getASeriesData", logger, CheckAuth, SeriesController.getASeriesData);
router.post("/getASeriesDataByTitle", logger, CheckAuth, SeriesController.getASeriesDataByTitle);
router.post("/setAFavouriteSeries", logger, CheckAuth, SeriesController.setAFavouriteSeries);
router.post("/getAFavouriteSeries", logger, CheckAuth, SeriesController.getAFavouriteSeries);

module.exports = router;
