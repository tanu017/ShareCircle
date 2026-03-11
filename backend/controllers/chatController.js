const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {

    const connectionId = req.params.connectionId;

    const messages = await Message.find({
      connection: connectionId
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};