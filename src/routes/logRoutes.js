const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createLog, getLogs, getUsage } = require("../controllers/logController");

router.post("/devices/:id/logs", auth, createLog);
router.get("/devices/:id/logs", auth, getLogs);
router.get("/devices/:id/usage", auth, getUsage);

module.exports = router;
