const { errorLogger } = require('./error-logger');

/**
 * Error handling middleware
 */
module.exports = () => (err, req, res, next) => {
  // console.log('error', err);

  if (!err.status) {
    err.status = 500;
    err.response = {
      errorCode: 0,
      message: 'Oops, an error occurred',
    };
    errorLogger(err);
  }

  return res.status(err.status).send(err.response);
};
