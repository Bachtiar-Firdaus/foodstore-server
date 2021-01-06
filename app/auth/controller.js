const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../user/model");
const config = require("../config");
const { getToken } = require("../utils/get-token");

function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Your're not login or token expired`,
    });
  }
  return res.json(req.user);
}

async function register(req, res, next) {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(error, null);
  }
  done();
}

async function login(req, res, next) {
  passport.authenticate("local", async function (error, user) {
    if (error) return next(error);
    if (!user)
      return res.json({ error: 1, message: "email or password incorect" });
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );
    return res.json({
      message: "logged in Successfully",
      user: user,
      token: signed,
    });
  })(req, res, next);
}

async function logout(req, res, next) {
  let token = getToken(req);
  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  //cek user token
  if (!user || !token) {
    return res.json({
      error: 1,
      message: "No user found",
    });
  }
  return res.json({
    error: 0,
    message: "Logout berhasil",
  });
}

module.exports = { register, localStrategy, login, me, logout };
