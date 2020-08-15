let R = require('ramda');
let method = require('./method.fun');

const BaseValidator = require('../../../../classes/src/BaseValidator');
const BaseController = require('../../../../classes/src/BaseController');

/**
 * An express middleware handler function
 * @typedef {(req: Express.Request, res: Express.Response, next: any) => void} Middleware
 */

/**
 * A fun route, product of a router method high order function evaluation
 * @typedef {(middleware: [Middleware] = []) => void} Route
 */

/**
 * A fun method, product of a evaluation of the fun.method high order function in a particular http method
 * @typedef {(route: String, handler: String, validator: BaseValidator = new BaseValidator()) => Route} Method
 */

/**
 * Encapsulates the available fun http methods
 *
 * @since  0.1.0
 *
 * @param {Express.Router}   router       The router that will handle the http calls.
 * @param {BaseController}   controller   The controller that will handle the http resources.
 *
 * @returns {{
 *   post: Method,
 *   get: Method,
 *   put: Method,
 *   patch: Method,
 *   delete: Method
 * }} An object of http methods
 */
let http = (router, controller) => {
  return {
    post: R.curry(method(router, controller)('post')),
    get: R.curry(method(router, controller)('get')),
    put: R.curry(method(router, controller)('put')),
    patch: R.curry(method(router, controller)('patch')),
    delete: R.curry(method(router, controller)('delete'))
  };
};

module.exports = http;
