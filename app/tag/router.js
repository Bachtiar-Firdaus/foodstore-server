const router = require("express").Router();
const multer = require("multer");
const { route } = require("../products/router");
const tagController = require("./controller");

router.post("/tags", multer().none(), tagController.store);
router.put("/tag/:id", multer().none(), tagController.update);
module.exports = router;
