const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    minlength: [3, "Panjang nama kategori minimal 3 karakter"],
    maxlength: [20, "Panjang maksimal kategori maxsimal 20 karakter"],
    require: [true, "Nama Kategori wajib di isi"],
  },
});

module.exports = model("Tag", tagSchema);
