const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const path = require("path");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const HASH_ROUND = 10;
let userSchema = Schema(
  {
    full_name: {
      type: String,
      require: [true, "Nama Harus di isi"],
      minlength: [3, "panjang karakter nama minimal 3"],
      maxlength: [255, "panjang karakter nama maxsimal 255"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      require: [true, "email wajib di isi"],
      maxlength: [255, "panjang karakter email minimal 255"],
    },
    password: {
      type: String,
      require: [true, "password wajib di isi"],
      maxlength: [255, "panjang karakter Password minimal 255"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

//validasi pengecekan email valid?
userSchema.path("email").validate(
  function (value) {
    //email regular expression
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    // jika ternyata `true` maka validasi berhasil
    // jika ternyata `false` maka validasi gagal
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!!`
);

//validasi pengecekan email sudah terdaftar?

userSchema.path("email").validate(
  async function (value) {
    try {
      //lakukan pencarian ke _collection_ User berdasarkan `email`
      //kode ini mengindikasikan bahwa
      //jika user ditemukan akan mengembalikan `false`
      //jika tidak ditemukan mengembalikan `true`
      const count = await this.model("User").count({ email: value });
      return !count;
    } catch (error) {
      throw err;
    }
  },
  (attr) => `${attr.value} Email telah terdaftar!!`
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
