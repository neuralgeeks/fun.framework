const autoBind = require('auto-bind');
const errorFun = require('../../functions/general/errors.fun');

/**
 * Base validator representation.
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs BaseValidator
 */
class BaseValidator {
  /**
   * Validator human readable name
   *
   * @since    0.1.0
   * @access   public
   *
   * @type     {String}
   *
   * @member   {String} name
   * @memberof BaseValidator
   */
  name = 'Base validator';

  /**
   * BaseValidator constructor
   *
   * @since      0.1.0
   * @access     public
   *
   * @constructs BaseValidator
   */
  constructor() {
    autoBind(this);
  }

  /**
   * Validates a request object and returns the request validated body.
   *
   * If this method throws an error the requests gets invalidated
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseValidator
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
   * @since      0.1.0
   * @access     public
   * @memberof   BaseValidator
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
   * @memberof   BaseValidator
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
}

module.exports = BaseValidator;
