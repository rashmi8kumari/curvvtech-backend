const Log = require("../models/Log");
const Device = require("../models/Device");

// Create a log entry
exports.createLog = async (req, res) => {
  try {
    const { id } = req.params; // device id
    const { event, value } = req.body;

    // Ensure device belongs to user
    const device = await Device.findOne({ _id: id, owner_id: req.user.id });
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    const log = new Log({ device_id: id, event, value });
    await log.save();

    res.status(201).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get last N logs
exports.getLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const device = await Device.findOne({ _id: id, owner_id: req.user.id });
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    const logs = await Log.find({ device_id: id })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get aggregated usage (e.g. units consumed in last 24h)
exports.getUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const range = req.query.range || "24h";

    let since = new Date();
    if (range === "24h") {
      since.setHours(since.getHours() - 24);
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user.id });
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    const logs = await Log.aggregate([
      { $match: { device_id: device._id, event: "units_consumed", timestamp: { $gte: since } } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);

    res.json({
      success: true,
      device_id: id,
      total_units_last_24h: logs.length > 0 ? logs[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
