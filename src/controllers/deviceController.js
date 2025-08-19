const Device = require("../models/Device");

// Register new device
exports.createDevice = async (req, res) => {
  try {
    const { name, type, status } = req.body;

    const device = new Device({
      name,
      type,
      status,
      owner_id: req.user.id
    });

    await device.save();

    res.status(201).json({ success: true, device });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// List devices (filter by type/status)
exports.getDevices = async (req, res) => {
  try {
    const query = { owner_id: req.user.id };
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;

    const devices = await Device.find(query);
    res.json({ success: true, devices });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update device
exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Device.findOneAndUpdate(
      { _id: id, owner_id: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Device not found" });

    res.json({ success: true, device: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete device
exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Device.findOneAndDelete({ _id: id, owner_id: req.user.id });

    if (!deleted) return res.status(404).json({ success: false, message: "Device not found" });

    res.json({ success: true, message: "Device removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Heartbeat (update last_active_at + status)
exports.heartbeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Device.findOneAndUpdate(
      { _id: id, owner_id: req.user.id },
      { status, last_active_at: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Device not found" });

    res.json({
      success: true,
      message: "Device heartbeat recorded",
      last_active_at: updated.last_active_at
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
