module.exports = (originalError, req, res, _next) => {
  if (originalError.status) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error happened:", originalError);
    }

    const result = {
      status: originalError.status,
      code: originalError.code,
      message: originalError.message,
      details: originalError.details,
    };

    res.status(originalError.status);
    res.json(result);
  } else {
    console.error(originalError);

    res.status(500);
    res.json({
      message: "Internal server error",
      code: "internal-server-error",
      status: 500,
    });
  }
};
