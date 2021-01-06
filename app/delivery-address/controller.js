const DeliveryAddress = require("./model");
const { policyFor } = require("../policy");

async function store(req, res, next) {
  let policy = policyFor(req.user);
  if (!policy.can("create", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }
  try {
    let payload = req.body;
    let user = req.user;

    let address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next();
  }
}

module.exports = { store };
