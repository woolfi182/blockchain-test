const logRequest = async (req, res, next) => {
  const logsService = req.app.get("logsService");
  try {
    const { path, method, ip } = req;
    const apiKey = req.headers["x-api-key"];

    await logsService.save({ path, method, ip, apiKey });
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  logRequest,
};
