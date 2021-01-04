const Tag = require("./model");

//add POST
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

//update PUT
async function update(req, res, next) {
  try {
    let payload = req.body;
    let tag = await Tag.findOneAndUpdate({ _id: req.params.id }, payload, {
      new: true,
      runValidators: true,
    });
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

//destroy DELTED
async function destroy(req, res, next) {
  try {
    let tag = await Tag.findOneAndDelete({ _id: req.params.id });
    return res.json(tag);
  } catch (error) {
    next(error);
  }
}
module.exports = { store, update, destroy };
