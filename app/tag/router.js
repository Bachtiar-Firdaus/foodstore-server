const router = require("express").Router();
const multer = require("multer");
const tagController = require("./controller");

router.post("/tags", multer().none(), tagController.store);
module.exports = router;
