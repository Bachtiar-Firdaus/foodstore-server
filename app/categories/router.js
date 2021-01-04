const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

//add POST
router.post("/categories", multer().none(), categoryController.store);
module.exports = router;
