const express = require("express");
const router = express.Router();
const { createRequest, getRequests } = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createRequest);
router.get("/", getRequests);

module.exports = router;