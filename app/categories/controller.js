const Category = require("./model");
const { policyFor } = require("../policy");
//get GET
async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query;
    let category = await Category.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    return res.json(category);
  } catch (err) {
    next(err);
  }
}

//add POST
async function store(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk membuat Category`,
      });
    }
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json(category);
  } catch (err) {
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

//update PUT
async function update(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("update", "Category")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk mengupdate Category`,
      });
    }
    let payload = req.body;
    let category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true }
    );
    return res.json(category);
  } catch (error) {
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

//destory DELETE
async function destory(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("delete", "Category")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk menghapus Category`,
      });
    }
    let deleted = await Category.findOneAndDelete({ _id: req.params.id });
    return res.json(deleted);
  } catch (error) {}
  next(error);
}
module.exports = { store, update, destory, index };
