const autoBind = require('auto-bind');
const errorFun = require('../../functions/general/errors.fun');

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
 * Base validator representation.
 */
class BaseValidator {
  /**
   * Validator human readable name
   *
   * @type     {String}
   */
  name = 'Base validator';

  /**
   * BaseValidator constructor
   */
  constructor() {
    autoBind(this);
  }

  /**
   * Validates a request object and returns the request validated body.
   *
   * If this method throws an error the requests gets invalidated
   *
   * @param      {Express.Request}       req      The request that will be validated
   * @param      {Express.Response}      res      The response associated with the request
   *
   * @throws     {any}
   * @returns    {Object}                The validated data Object
   */
  async validate(req, res) {
    return {};
  }

  /**
   * Throws a JSONAPI BaseError and sends feedback to the response
   *
   * @param      {Express.Request}       req      The request that throwed the error
   * @param      {Express.Response}      res      The response that will send the error feedback
   * @param      {BaseError}             [error]  The JSONAPI error to be thrown
   *
   * @throws     {BaseError}
   * @returns    {never}
   */
  throw(req, res, error) {
    errorFun.throw(req, res, error);
  }

  /**
   * Returns a JSONAPI based error handler that throws a JSONAPI BaseError and sends feedback
   * to the response
   *
   * @param      {Express.Request}       req      The request that throwed the error
   * @param      {Express.Response}      res      The response that will send the error feedback
   * @param      {BaseError}             [error]  The JSONAPI error to be thrown
   *
   * @returns    {(any) => never}        The error handler
   */
  catch(req, res, error) {
    return errorFun.catch(req, res, error);
  }
}

module.exports = BaseValidator;
