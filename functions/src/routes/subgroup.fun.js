let R = require('ramda');
const BaseController = require('../../../classes/src/BaseController');
const group = require('./group.fun');

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
 * A fun route, product of a router method high order function
 * @typedef {(middleware: Middleware[] = []) => void} Route
 */

/**
 * Encapsulates a routes subgroup, this is, a group that behaves as a route
 * so that a group can group it within its routes.
 *
 * @param {Express.Router}   router       The router that will handle the group.
 * @param {BaseController}   controller   The controller that will handle the group resources.
 *
 * @returns {(middleware: Middleware[]) => (routes: Route[]) => Route } A high order function that handles a routes subgroup, this is, a group that behaves as a route so that a group can group it within its routes.
 */
const subgroup =
  (router, controller) => (subgroupMiddleware) => (routes) => (middlewares) => {
    group(router, controller)(R.concat(middlewares, subgroupMiddleware))(
      routes
    );
  };

module.exports = subgroup;
