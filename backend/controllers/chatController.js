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

exports.createMessage = async (req, res) => {
  try {
    const { connection, sender, message } = req.body;

    if (!connection || !sender || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new Message({
      connection,
      sender,
      message
    });

    await newMessage.save();
    res.status(201).json(newMessage);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};