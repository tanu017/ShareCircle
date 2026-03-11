const HelpConnection = require("../models/HelpConnection");
const Request = require("../models/Request");

exports.helpRequest = async (req, res) => {
  try {

    const requestId = req.params.requestId;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const connection = new HelpConnection({
      request: requestId,
      volunteer: req.user._id,
      ngo: request.createdBy
    });

    await connection.save();

    res.status(201).json({
      message: "You are now helping this request",
      connection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};