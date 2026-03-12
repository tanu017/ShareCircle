const HelpConnection = require("../models/HelpConnection");
const Request = require("../models/Request");

exports.helpRequest = async (req, res) => {
  try {

    const requestId = req.params.requestId;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Prevent users from helping their own request
    if (request.createdBy.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot help your own request" });
    }

    // Check if ANY valid connection already exists for this request
    // Valid connection = volunteer !== ngo
    const allConnections = await HelpConnection.find({
      request: requestId
    });

    const existingConnection = allConnections.find(conn => {
      const volunteerId = conn.volunteer.toString();
      const ngoId = conn.ngo.toString();
      // Only return valid connections (where volunteer !== ngo)
      return volunteerId !== ngoId;
    });

    if (existingConnection) {
      return res.status(200).json({
        message: "Using existing help connection for this request",
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

    // Filter out invalid connections where user is chatting with themselves
    // (volunteer and ngo are the same person)
    const validConnections = connections.filter(conn => {
      const volunteerId = conn.volunteer.toString();
      const ngoId = conn.ngo.toString();

      // Exclude if volunteer and ngo are the same person
      if (volunteerId === ngoId) {
        return false;
      }

      return true;
    });

    res.json(validConnections);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};