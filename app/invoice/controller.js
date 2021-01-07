const { subject } = require("@casl/ability");
const Invoice = require("./model");
const { policyFor } = require("../policy");

async function show(req, res, next) {
  try {
    // dapatkan _route_ params `order_id
    let { order_id } = req.params;

    //dapatkan data `invoice` berdasarkan order_id
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");

    //cek punya akses atau tidak
    let policy = policyFor(req.user);

    let subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });

    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat invoice ini.`,
      });
    }

    //respon ke client
    return res.json(invoice);
  } catch (error) {
    return res.json({
      error: 1,
      message: `Error when Getting Invoice`,
    });
  }
}

module.exports = { show };
