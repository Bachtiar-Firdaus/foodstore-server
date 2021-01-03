const router = require("express").Router();
const multer = require("multer");
const os = require("os");

const productController = require("./controller");
//Get
router.get("/products", productController.index);

//create POST
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.store
);

//Update PUT
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.update
);
module.exports = router;
