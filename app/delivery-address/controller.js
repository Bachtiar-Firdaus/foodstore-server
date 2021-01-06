const DeliveryAddress = require("./model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");

//Create POST
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
    next(error);
  }
}

//Update PUT
async function update(req, res, next) {
  let policy = policyFor(req.user);
  try {
    let { id } = req.params;
    let { _id, ...payload } = req.body;
    let address = await DeliveryAddress.findOne({ _id: id });
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to modify this resource`,
      });
    }
    address = await DeliveryAddress.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    return res.json(address);
  } catch (error) {
    return res.json({
      error: 1,
      message: error.message,
      fields: error.errors,
    });
    next(error);
  }
}
module.exports = { store, update };
