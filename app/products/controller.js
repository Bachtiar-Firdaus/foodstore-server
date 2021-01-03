const fs = require("fs");
const path = require("path");

const Product = require("./model");
const config = require("../config");

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        let product = new Product({
          ...payload,
          image_url: filename,
        });
        await product.save();
        return res.json(product);
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidasiError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}
async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query;
    let products = await Product.find()
      .limit(parseInt(limit)) // <---karna data string di rubah ke integer
      .skip(parseInt(skip)); // <---karna data string di rubah ke integer

    return res.json(products);
  } catch (err) {
    next(err);
  }
}
module.exports = { index, store };
