const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: { type: String, require: [true, "provinsi harus di isi"] },
      kabupaten: { type: String, require: [true, "kabupaten harus di isi"] },
      kecamatan: { type: String, require: [true, "kecamatan harus di isi"] },
      kelurahan: { type: String, require: [true, "kelurahan harus di isi"] },
      detail: { type: String },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order_items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: "order_number" });

module.exports = model("Order", orderSchema);
