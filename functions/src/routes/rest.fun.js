const http = require('./http/http.fun');

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
 * @typedef {(middleware: Middleware[] = []) => void} Route
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
 * @param {Express.Router}   router       The router that will handle the REST routes.
 * @param {BaseController}   controller   The controller that handle resources.
 *
 * @returns {(validators: RestValidators) => Route } A high order function that handles the REST routes.
 */
const rest =
  (router, controller) =>
  (restValidators) =>
  (middlewares = []) => {
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

module.exports = rest;
