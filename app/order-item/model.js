const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);

const orderItemSchema = Schema({
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
    required: [true, "harga item harus di isi"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);
