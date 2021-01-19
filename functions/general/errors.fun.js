const Logger = require('../../classes/Logger');
const logger = new Logger();
const BaseError = require('../../classes/src/BaseError');
const GenericInternalServerError = require('../../classes/src/errors/GenericInternalServerError');
const ExceptionAfterHeadersSentError = require('../../classes/src/errors/ExceptionAfterHeadersSentError');

/**
 * @license
 * Copyright 2020 neuralgeeks LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns a JSONAPI based error handler that throws a JSONAPI error and sends feedback
 * to the response.
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
    // Case: the response error is not defined
    if (!error)
      error = new GenericInternalServerError({
        meta: { route: req.originalUrl }
      });

    // Attaching the catched error
    error.meta.internalError = catchedError;

    // Case: headers already sent
    if (res.headersSent)
      throw new ExceptionAfterHeadersSentError('fun.catch', {
        route: req.originalUrl,
        originalError: error.compact()
      }).compact();

    res.status(error.status).json({ errors: [error.compact()] });

    throw error.compact();
  };
};

/**
 * Throws a JSONAPI error and sends feedback to the response.
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
  // Case: the response error is not defined
  if (!error)
    error = new GenericInternalServerError({
      meta: { route: req.originalUrl }
    });

  // Case: headers already sent
  if (res.headersSent)
    throw new ExceptionAfterHeadersSentError('fun.throw', {
      route: req.originalUrl,
      originalError: error.compact()
    }).compact();

  res.status(error.status).json({ errors: [error.compact()] });

  throw error.compact();
};

/**
 * Handles an internal error. If the headers were already sent, it is assumed that some kind of feedback
 * was given to the user. If the headers were not already sent, then it sends an internal server
 * JSONAPI error as feedback to the response.
 *
 * @since  0.3.0
 *
 * @param {Express.Request}       req      The request that throwed the error
 * @param {Express.Response}      res      The response that will send the error feedback
 * @param {any}                   error    The JSONAPI error to be thrown
 */
let internal = (req, res, error) => {
  if (res.headersSent) logger.error(error);
  else {
    let internalError = new GenericInternalServerError({
      detail: 'An unexpected exception has occurred.',
      meta: { route: req.originalUrl, error: error }
    });
    res
      .status(internalError.status)
      .json({ errors: [internalError.compact()] });
    logger.error(internalError.compact());
  }
};

module.exports.catch = catcher;
module.exports.throw = thrower;
module.exports.internal = internal;
