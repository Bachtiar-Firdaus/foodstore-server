const fs = require("fs");
const path = require("path");

const Product = require("./model");
const Category = require("../categories/model");
const Tag = require("../tag/model");
const config = require("../config");

//add
async function store(req, res, next) {
  try {
    let payload = req.body;

    //relational collection one to one
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }
    //relational collection one to many
    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }
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
//get GET
async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query;
    let products = await Product.find()
      .limit(parseInt(limit)) // <---karna data string di rubah ke integer
      .skip(parseInt(skip)) // <---karna data string di rubah ke integer
      .populate("category") // <---mendapatkan data collection dengan konsept one to one
      .populate("tags"); // <---mendapatkan data collection dengan consept one to many
    return res.json(products);
  } catch (err) {
    next(err);
  }
}
//update PUT
async function update(req, res, next) {
  try {
    let payload = req.body;

    //relational collection one to one
    let category = await Category.findOne({
      name: { $regex: payload.category, $options: "i" },
    });

    if (category) {
      payload = { ...payload, category: category._id };
    } else {
      delete payload.category;
    }

    //relational collection one to many
    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }
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
        // (1) cari produk yang akan diupdate
        let product = await Product.findOne({ _id: req.params.id });

        // (2) dapatkan absolut path ke gambar dari produk yang akan diupdate
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        // (3) cek apakah absolute path memang ada di file system
        if (fs.existsSync(currentImage)) {
          // (4) jika ada hapus dari file system
          fs.unlinkSync(currentImage);
        }

        // (5) update produk ke MongoDB
        product = await Product.findOneAndUpdate(
          { _id: req.params.id },
          { ...payload, image_url: filename },
          { new: true, runValidators: true }
        );

        return res.json(product);
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      // (6) update produk jika tidak ada file upload
      let product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );

      return res.json(product);
    }
  } catch (err) {
    // ----- cek tipe error ---- //
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

//destroy delete
async function destroy(req, res, next) {
  try {
    let product = await Product.findOneAndDelete({ _id: req.params.id });

    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.json(product);
  } catch (err) {
    next(err);
  }
}
module.exports = { index, update, store, destroy };
