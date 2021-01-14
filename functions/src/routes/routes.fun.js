const http = require('./http/http.fun');
const group = require('./group.fun');
const subgroup = require('./subgroup.fun');
const rest = require('./rest.fun');
const R = require('ramda');

const BaseValidator = require('../../../classes/src/BaseValidator');
const BaseController = require('../../../classes/src/BaseController');

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
 *  A high order function that handles the REST routes.
 * @typedef {(validators: RestValidators) => Route } Rest
 */

/**
 * A high order function that handles a routes group.
 * @typedef {(middleware: [Middleware]) => (routes: [Route]) => void} Group
 */

/**
 * A high order function that handles a routes subgroup, this is, a group that behaves as a route
 * so that a group can group it within its routes.
 * @typedef {(middleware: [Middleware]) => (routes: [Route]) => Route} Subgroup
 */

/**
 * Wraps up all fun routes related methods and high order funtions.
 *
 * @since  0.1.0
 *
 * @param {Express.Router}   router       The router that will handle the routes.
 * @param {BaseController}   controller   The controller that will handle the routes resources.
 *
 * @returns {{
 *   post: Method,
 *   get: Method,
 *   put: Method,
 *   patch: Method,
 *   delete: Method,
 *   group: Group,
 *   subgroup: Group,
 *   rest: Rest
 * }} Routes related available methods
 */
let routes = (router, controller) => {
  return R.mergeAll([
    http(router, controller),
    {
      group: group(router, controller),
      subgroup: subgroup(router, controller),
      rest: rest(router, controller)
    }
  ]);
};

module.exports = routes;
