const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    const request = new Request({
      title,
      description,
      location,
      createdBy: req.user.id
    });

    await request.save();

    res.status(201).json(request);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("createdBy", "name email");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};