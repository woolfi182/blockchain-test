const rateLimit = require("express-rate-limit");

// could be moved to config or ENVS (even to Docker-compose)
const rateConfig = {
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 rpw
};

const apiLimiter = rateLimit({
  ...rateConfig,
  keyGenerator(req) {
    return req.headers["x-api-key"];
  },
  handler(req, res, next) {
    res.status(429).json({
      message: "API rate limit exceeded",
    });
  },
});

const mockedApiKeys = ["key1", "key2", "key3"];

const apiAuthentication = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !mockedApiKeys.includes(apiKey)) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  next();
};

module.exports = {
  apiLimiter,
  apiAuthentication,
};
