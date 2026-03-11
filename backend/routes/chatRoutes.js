const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMessages } = require("../controllers/chatController");

router.get("/:connectionId", authMiddleware, getMessages);

module.exports = router;