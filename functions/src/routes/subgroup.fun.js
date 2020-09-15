let R = require('ramda');
const BaseController = require('../../../classes/src/BaseController');
const group = require('./group.fun');

/**
 * An express middleware handler function
 * @typedef {(req: Express.Request, res: Express.Response, next: any) => void} Middleware
 */

/**
 * A fun route, product of a router method high order function
 * @typedef {(middleware: [Middleware] = []) => void} Route
 */

/**
 * Encapsulates a routes subgroup, this is, a group that behaves as a route
 * so that a group can group it within its routes.
 *
 * @since  0.1.0
 *
 * @param {Express.Router}   router       The router that will handle the group.
 * @param {BaseController}   controller   The controller that will handle the group resources.
 *
 * @returns {(middleware: [Middleware]) => (routes: [Route]) => Route } A high order function that handles a routes subgroup, this is, a group that behaves as a route so that a group can group it within its routes.
 */
let subgroup = (router, controller) => {
  return (subgroupMiddleware) => {
    return (routes) => {
      return (middlewares) => {
        let completeMiddleware = R.append(middlewares, subgroupMiddleware);
        group(router, controller)(completeMiddleware)(routes);
      };
    };
  };
};

module.exports = subgroup;
