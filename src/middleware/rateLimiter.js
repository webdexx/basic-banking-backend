const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50000,
    message: "Too many requests from this IP. Try Again later"
}
)

module.exports = rateLimiter;