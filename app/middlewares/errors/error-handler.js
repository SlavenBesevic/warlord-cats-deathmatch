const bunyan = require('bunyan');

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

    bunyan.createLogger({
      name: err.name,
      streams: [{ level: 'error', path: 'error.log' }],
    }).error(err);
  }

  return res.status(err.status).send(err.response);
};
