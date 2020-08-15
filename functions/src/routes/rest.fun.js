const http = require('./http/http.fun');

const BaseValidator = require('../../../classes/src/BaseValidator');
const BaseController = require('../../../classes/src/BaseController');

/**
 * An express middleware handler function
 * @typedef {(req: Express.Request, res: Express.Response, next: any) => void} Middleware
 */

/**
 * A fun route, product of a router method high order function evaluation
 * @typedef {(middleware: [Middleware] = []) => void} Route
 */

/**
 * An object that holds a validator for each rest endpoint, this is, index, store, show, update and destroy
 * @typedef {{
 *   index: BaseValidator,
 *   store: BaseValidator,
 *   show: BaseValidator,
 *   update: BaseValidator,
 *   destroy: BaseValidator
 * }} RestValidators
 */

/**
 * Handles the REST routes for a single resource.
 *
 * The REST routes of a resource are treated as a single route (that register many endopoints on the router),
 * this way it can be group within a routes group along with simple routes.
 *
 *
 * @since  0.1.0
 *
 * @param {Express.Router}   router       The router that will handle the REST routes.
 * @param {BaseController}   controller   The controller that handle resources.
 *
 * @returns {(validators: RestValidators) => Route } A high order function that handles the REST routes.
 */
let rest = (router, controller) => {
  return (restValidators) => {
    return (middlewares = []) => {
      // index - GET
      http(router, controller).get(
        '/',
        'index',
        new restValidators.index()
      )(middlewares);

      // store - POST
      http(router, controller).post(
        '/',
        'store',
        new restValidators.store()
      )(middlewares);

      // show - GET
      http(router, controller).get(
        '/:id',
        'show',
        new restValidators.show()
      )(middlewares);

      // update - PUT
      http(router, controller).put(
        '/:id',
        'update',
        new restValidators.update()
      )(middlewares);

      // destroy - DELETE
      http(router, controller).delete(
        '/:id',
        'destroy',
        new restValidators.destroy()
      )(middlewares);
    };
  };
};

module.exports = rest;
