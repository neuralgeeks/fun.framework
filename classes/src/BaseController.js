const R = require('ramda');
const autoBind = require('auto-bind');

const errorFun = require('../../functions/general/errors.fun');
const JSONAPIFun = require('../../functions/JSONAPI/JSONAPI.fun');

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
 * Base controller representation.
 */
class BaseController {
  /**
   * BaseController constructor.
   */
  constructor() {
    autoBind(this);
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

  /**
   * Returns a decorated express response object that contains JSONAPI standard functionality
   * and transform pattern support
   *
   * @param      {Express.Response}    res      The express response to be decorated
   * @param      {Number}              [code]   The status to code of the decorated response
   *
   * @returns    {Object}              The Object that holds the decorated response
   */
  response(res, code = 200) {
    return {
      express: res.status(code),
      JSONAPI: JSONAPIFun(res, code)
    };
  }
}

module.exports = BaseController;
