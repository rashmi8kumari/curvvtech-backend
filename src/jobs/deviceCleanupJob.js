const cron = require("node-cron");
const Device = require("../models/device.model"); // mongoose model

// Job: Har 1 ghante chalega
cron.schedule("0 * * * *", async () => {
  console.log("⏳ Running Device Cleanup Job...");

  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h pehle ka time

  try {
    const result = await Device.updateMany(
      { last_active_at: { $lt: cutoff }, status: "active" },
      { $set: { status: "inactive" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ ${result.modifiedCount} devices deactivated due to inactivity`);
    } else {
      console.log("No inactive devices found");
    }
  } catch (err) {
    console.error("❌ Error in cleanup job:", err.message);
  }
});

