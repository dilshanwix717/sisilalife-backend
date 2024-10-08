const express = require("express");
const {logger} = require("../utils/logger");
const {CheckAuth} = require("../middleware/check-auth");
const router = express.Router();

const ContentController = require("../controllers/contentController")
const UserController = require("../controllers/MobileAppControllers/UserController");


router.post("/testGet", logger, CheckAuth, ContentController.testGet); //done
router.post("/getReferralNumbers/", logger, CheckAuth, ContentController.getReferralNumbers);//done
router.post("/getContentForTheChip", logger, CheckAuth, ContentController.getContentForTheChip); //done
router.post("/getLatestItemsForCategories", logger, CheckAuth, ContentController.getLatestItemsForCategories);//done
router.get("/getFeaturedTeleseries", logger, CheckAuth, ContentController.getFeaturedTeleseries);//done
router.get("/getSusilaOriginals", logger, CheckAuth, ContentController.getSusilaOriginals);//done
router.post("/getHighlights", logger, CheckAuth, ContentController.getHighlights);//done
router.get("/getBanners", logger, CheckAuth, ContentController.getBanners);//done
router.get("/getSeasonVolume", logger, CheckAuth, ContentController.getSeasonVolume);//done
router.get("/getContentByTitleAndSeasonData", logger, CheckAuth, ContentController.getContentByTitleAndSeasonData);//done
router.post("/getContentProvidersData", logger, CheckAuth, ContentController.getContentProvidersData);//done
router.get("/getSeries", logger, CheckAuth, ContentController.getSeries);//done
router.get("/getSeriesCommon", logger, CheckAuth, ContentController.getSeriesCommon);//done
router.get("/getASeries", logger, CheckAuth, ContentController.getASeries);//done
router.post("/getASeriesBySeriesId", logger, CheckAuth, ContentController.getASeriesBySeriesId);//done
router.post("/getComedy", logger, CheckAuth, ContentController.getComedy);//done
router.get("/getMovies", logger, CheckAuth, ContentController.getMovies);//done
router.post("/getMusic", logger, CheckAuth, ContentController.getMusic);//done
router.post("/getContentForCategory", logger, CheckAuth, ContentController.getContentForCategory);
router.get("/getContentById", logger, CheckAuth, ContentController.getContentById);//done
router.get("/getCooking", logger, CheckAuth, ContentController.getCooking);//done
router.get("/getBusiness", logger, CheckAuth, ContentController.getBusiness);//done
router.get("/getStageDrama", logger, CheckAuth, ContentController.getStageDrama);//done
router.get("/getDocumentary", logger, CheckAuth, ContentController.getDocumentary);//done
router.get("/getRealityShows", logger, CheckAuth, ContentController.getRealityShows);//done
router.get("/getAllContent", logger, CheckAuth, ContentController.getAllContent);//done
router.post("/getContentIterateData", logger, CheckAuth, ContentController.getContentIterateData);//done
router.post("/getContentSeriesIterateData", logger, CheckAuth, ContentController.getContentSeriesIterateData);//done
router.post("/getContentForEpisodeLineUp", logger, CheckAuth, ContentController.getContentForEpisodeLineUp);//done
router.post("/getContentIterateDataForContinueWatching", logger, CheckAuth, ContentController.getContentIterateDataForContinueWatching);//done
router.post("/getContentIterateDataForMyList", logger, CheckAuth, ContentController.getContentIterateDataForMyList);//done
router.get("/getContentByContentId", logger, CheckAuth, ContentController.getContentByContentId);//done

router.get("/getLatestContent", logger, CheckAuth, ContentController.getLatestContent);//done
router.get("/getLatestTVSeries", logger, CheckAuth, ContentController.getLatestTVSeries);//done
router.get("/getRandomTVSeries", logger, CheckAuth, ContentController.getRandomTVSeries);//done
router.get("/getRandomMovies", logger, CheckAuth, ContentController.getRandomMovies);//done
router.get("/getPopularContent", logger, CheckAuth, ContentController.getPopularContent);//done

router.post("/checkForUserInContentsView", logger, CheckAuth, ContentController.checkForUserInContentsView);
router.post("/addViewCount/:id", logger, CheckAuth, ContentController.addViewCount);
router.post("/setAFavouriteContent/:id", logger, CheckAuth, ContentController.setAFavouriteContent);
router.post("/sendContactUsMessage", logger, CheckAuth, ContentController.sendContactUsMessage);
router.post("/getAFavouriteContent", logger, CheckAuth, ContentController.getAFavouriteContent);

module.exports = router;