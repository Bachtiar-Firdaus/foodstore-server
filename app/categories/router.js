const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

//add POST
router.post("/categories", multer().none(), categoryController.store);
router.put("/category/:id", multer().none(), categoryController.update);
module.exports = router;
