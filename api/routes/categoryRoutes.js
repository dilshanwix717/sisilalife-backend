const express = require("express");
const {logger} = require("../utils/logger");
const {CheckAuth} = require("../middleware/check-auth");
const router = express.Router();

const CategoryController = require("../controllers/categoryController");

router.post("/getContent", logger, CheckAuth, CategoryController.getContent);
router.post("/getSubCategory", logger, CheckAuth, CategoryController.getSubCategory);

module.exports = router;
