const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  heartbeat
} = require("../controllers/deviceController");



router.post("/", auth, createDevice);
router.get("/", auth, getDevices);
router.patch("/:id", auth, updateDevice);
router.delete("/:id", auth, deleteDevice);
router.post("/:id/heartbeat", auth, heartbeat);

module.exports = router;
