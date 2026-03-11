const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { helpRequest, getMyConnections } = require("../controllers/helpController");

router.get("/my-connections", authMiddleware, getMyConnections);

router.post("/:requestId/help", authMiddleware, helpRequest);

module.exports = router;