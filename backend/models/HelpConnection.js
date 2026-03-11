const mongoose = require("mongoose");

const helpConnectionSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("HelpConnection", helpConnectionSchema);