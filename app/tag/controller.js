const Tag = require("./model");

async function store(req, res, next) {
  try {
    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();
    return res.json(tag);
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

module.exports = { store };
