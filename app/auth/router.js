const router = require("express").Router();
const multer = require("multer");

const controller = require("./controller");

router.post("/register", multer().none(), controller.register);

module.exports = router;
