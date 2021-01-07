const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);

const cartItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, "panjang nama makanan minimal 5 karakter"],
    required: [true, "name harus di isi"],
  },
  qty: {
    type: Number,
    required: [true, "qty harus di isi"],
    min: [1, "minimal qty adalah 1"],
  },
  price: {
    type: Number,
    default: 0,
  },

  image_url: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemSchema);
