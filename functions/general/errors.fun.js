const BaseError = require('../../classes/src/BaseError');

/**
 * Returns a JSONAPI based error handler that throws a JSONAPI BaseError and sends feedback
 * to the response
 *
 * @since  0.1.0
 *
 * @param {Express.Request}       req      The request that throwed the error
 * @param {Express.Response}      res      The response that will send the error feedback
 * @param {BaseError}             [error]  The JSONAPI error to be thrown
 *
 * @returns {(any) => never} The error handler
 */
let catcher = (req, res, error) => {
  return async (catchedError) => {
    if (!error) {
      error = new BaseError({
        status: 500,
        title: 'genericInternalServerError',
        detail:
          'The server encounter an exception, check meta for internal error details',
        meta: {
          route: req.originalUrl
        }
      });
    }
    error.meta.internalError = catchedError;
    res.status(error.status).json({ errors: [error.compact()] });

    throw error.compact();
  };
};

/**
 * Throws a JSONAPI BaseError and sends feedback to the response
 *
 * @since  0.1.0
 *
 * @param {Express.Request}       req      The request that throwed the error
 * @param {Express.Response}      res      The response that will send the error feedback
 * @param {BaseError}             [error]  The JSONAPI error to be thrown
 *
 * @throws {BaseError}
 */
let thrower = (req, res, error) => {
  if (!error) {
    error = new BaseError({
      status: 500,
      title: 'genericInternalServerError',
      detail:
        'The server encounter an exception, check meta for internal error details',
      meta: {
        route: req.originalUrl
      }
    });
  }
  res.status(error.status).json({ errors: [error.compact()] });

  throw error.compact();
};

module.exports.catch = catcher;
module.exports.throw = thrower;
