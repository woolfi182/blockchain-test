class StandardError extends Error {
  constructor(message, props) {
    super(message);
    this.status = props.status;
    this.code = props.code;
    this.errors = props.errors;
    if (props.details) {
      this.details = props.details;
    }
  }
}

exports.ValidationError = class ValidationError extends StandardError {
  constructor(message, details, subErrors) {
    super(message, {
      code: "validation",
      errors: subErrors,
      status: 400,
      details,
    });
  }
};

exports.EntityNotFoundError = class EntityNotFoundError extends StandardError {
  constructor(details, subErrors) {
    super("Entity not found", {
      code: "not-found",
      errors: subErrors,
      status: 404,
      details,
    });
  }
};

exports.BadRequestError = class BadRequestError extends StandardError {
  constructor(details, ...subErrors) {
    const isMessage = typeof details === "string";
    const message = isMessage ? details : "Bad request";
    const dets = isMessage ? subErrors[0] : details;
    const errors = subErrors.pop();

    super(message, {
      code: "bad-request",
      errors,
      status: 400,
      details: dets,
    });
  }
};

exports.UnauthorizedError = class UnauthorizedError extends StandardError {
  constructor(details, subErrors) {
    super("Unauthorized", {
      code: "unauthorized",
      errors: subErrors,
      status: 401,
      details,
    });
  }
};

exports.ServerCantKeepWorking = class ServerCantKeepWorking extends (
  StandardError
) {
  constructor(message, details, subErrors) {
    super("Internal problem on our servers", {
      code: "server-panic",
      errors: subErrors,
      status: 500,
      details: {
        ...details,
        internalMessage: message,
      },
    });
  }
};
