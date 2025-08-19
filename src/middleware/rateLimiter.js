const rateLimit = require("express-rate-limit");

// 100 requests per minute per user
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100, // limit each user
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
