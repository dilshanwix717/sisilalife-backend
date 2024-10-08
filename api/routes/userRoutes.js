const express = require("express");
const {logger} = require("../utils/logger");
const {CheckAuth} = require("../middleware/check-auth");
const router = express.Router();

const UserController = require("../controllers/MobileAppControllers/UserController")
const User = require("../controllers/user");

//user provide
router.post("/getAlreadyExistUser/:id", logger, CheckAuth, UserController.getAlreadyExistUser)
router.post("/getContinueWatching/:id", logger, CheckAuth, UserController.getContinueWatching);
router.post("/setContinueWatching/:id", logger, CheckAuth, User.setContinueWatching);
router.post("/getWishListDataForUser/:id", logger, CheckAuth, UserController.getWishListDataForUser);
router.post("/setWishListDataForUser/:id", logger, CheckAuth, UserController.setWishListDataForUser);
router.post("/getReferralNumbers", logger, CheckAuth, UserController.getReferralNumbers);

//authentications
// router.post("/login" , logger , User.login);

module.exports = router;
