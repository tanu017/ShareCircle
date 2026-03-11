const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { helpRequest } = require("../controllers/helpController");

router.post("/:requestId/help", authMiddleware, helpRequest);

module.exports = router;