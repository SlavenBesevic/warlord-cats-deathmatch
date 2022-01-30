/**
 * Catch errors from async functions in routes
 * @param {Object} fn
 */
module.exports.resolveRequest = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
