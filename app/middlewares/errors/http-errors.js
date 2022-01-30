/**
 * Create HTTP Error
 * @param {Object} err
 * @param {String} description
 * @throws {Error}
 */
module.exports.HTTPError = class extends Error {
  constructor(err, description) {
    super(err.response.message);
    this.status = err.status;
    this.response = err.response;
    this.response.description = description;
  }
};

/**
 * List of all errors
 */
module.exports.errorConstants = {
  TOKEN_EXPIRED: {
    status: 401,
    response: {
      errorCode: 0,
      message: 'Token expired',
    },
  },
  AUTHORIZATION_TOKEN: {
    status: 401,
    response: {
      errorCode: 1,
      message: 'No authorization token was found',
    },
  },
  MISSING_PARAMETERS: {
    status: 400,
    response: {
      errorCode: 2,
      message: 'Missing parameters',
    },
  },
  NOT_ACCEPTABLE: {
    status: 406,
    response: {
      errorCode: 3,
      message: 'Not acceptable',
    },
  },
  NOT_FOUND: {
    status: 404,
    response: {
      errorCode: 4,
      message: 'Not found',
    },
  },
  FORBIDDEN: {
    status: 403,
    response: {
      errorCode: 5,
      message: 'Insufficient privileges',
    },
  },
  INVALID_VALUE: {
    status: 400,
    response: {
      errorCode: 6,
      message: 'Value is not valid',
    },
  },
  BAD_REQUEST: {
    status: 400,
    response: {
      errorCode: 7,
      message: 'Bad Request',
    },
  },
  CREDENTIALS_ERROR: {
    status: 401,
    response: {
      errorCode: 8,
      message: 'Wrong credentials',
    },
  },
  INVALID_EMAIL: {
    status: 400,
    response: {
      errorCode: 9,
      message: 'Please fill a valid email address',
    },
  },
  DUPLICATE_EMAIL: {
    status: 406,
    response: {
      errorCode: 10,
      message: 'This email address is already registered',
    },
  },
  FILE_UPLOAD_ERROR: {
    status: 400,
    response: {
      errorCode: 11,
      message: 'Something went wrong during file upload',
    },
  },
  UNAUTHORIZED_ERROR: {
    status: 401,
    response: {
      errorCode: 12,
      message: 'Invalid credentials',
    },
  },
  UNKNOWN_DATABASE_ERROR: {
    status: 400,
    response: {
      errorCode: 13,
      message: 'Unknown database error',
    },
  },
};
