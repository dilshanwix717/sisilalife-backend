const express = require("express");
const {logger} = require("../utils/logger");
const {CheckAuth} = require("../middleware/check-auth");
const router = express.Router();

const ProfileController = require("../controllers/profileController");

router.post("/getContentProviderProfilesForId", logger, CheckAuth, ProfileController.getContentProviderProfilesForId)


module.exports = router;