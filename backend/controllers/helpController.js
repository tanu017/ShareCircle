const HelpConnection = require("../models/HelpConnection");
const Request = require("../models/Request");

exports.helpRequest = async (req, res) => {
  try {

    const requestId = req.params.requestId;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Prevent duplicate help requests
    const existingConnection = await HelpConnection.findOne({
      request: requestId,
      volunteer: req.user._id
    });

    if (existingConnection) {
      return res.status(200).json({
        message: "You are already helping this request",
        connection: existingConnection
      });
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
exports.getMyConnections = async (req, res) => {
  try {

    const connections = await HelpConnection.find({
      $or: [
        { volunteer: req.user._id },
        { ngo: req.user._id }
      ]
    }).populate("request");

    res.json(connections);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};