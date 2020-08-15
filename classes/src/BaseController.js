const errorFun = require('../../functions/general/errors.fun');
const R = require('ramda');
const JSONAPIFun = require('../../functions/JSONAPI/JSONAPI.fun');

/**
 * Base controller representation.
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs BaseController
 */
class BaseController {
  /**
   * Throws a JSONAPI BaseError and sends feedback to the response
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseController
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
   * @since      0.1.0
   * @access     public
   * @memberof   BaseController
   *
   * @param      {Express.Request}       req      The request that throwed the error
   * @param      {Express.Response}      res      The response that will send the error feedback
   * @param      {BaseError}             [error]  The JSONAPI error to be thrown
   *
   * @returns    {(any) => never}        The error handler
   */
  catch(req, res, error) {
    errorFun.catch(req, res, error);
  }

  /**
   * Returns a decorated express response object that contains JSONAPI standard functionality
   * and transform pattern support
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseController
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
