const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const productScema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      maxlength: [255, "Panjang nama makanan maxsimal 255 karakter"],
      require: [true, "Nama produk harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Panjang description maxsimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
  },
  { Timestamp: true }
);
module.exports = model("Product", productScema);
