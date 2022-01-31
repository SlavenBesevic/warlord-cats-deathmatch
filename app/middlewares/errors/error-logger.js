const bunyan = require('bunyan');

module.exports.errorLogger = (err) => {
  bunyan.createLogger({
    name: err.name,
    streams: [{ level: 'error', path: 'error.log' }],
  }).error(err);
};
