const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  connection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HelpConnection",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);