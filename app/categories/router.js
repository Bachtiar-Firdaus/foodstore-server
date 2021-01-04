const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

//add POST
router.get("/categories", categoryController.index);
router.post("/categories", multer().none(), categoryController.store);
router.put("/category/:id", multer().none(), categoryController.update);
router.delete("/category/:id", categoryController.destory);
module.exports = router;
