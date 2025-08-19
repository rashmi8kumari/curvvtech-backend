require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const logRoutes = require("./routes/logRoutes");
const rateLimiter = require("./middleware/rateLimiter");



console.log("Mongo URI:", process.env.MONGO_URI);  // Debug line

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter); 

app.use("/auth", authRoutes);
app.use("/devices", deviceRoutes);
app.use("/", logRoutes);


app.get("/", (req,res) => {
    res.send("CurvvTech Backend is running...");
});


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("DB Error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
