let R = require('ramda');
let method = require('./method.fun');

const BaseValidator = require('../../../../classes/src/BaseValidator');
const BaseController = require('../../../../classes/src/BaseController');

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
 * A fun method, product of a evaluation of the fun.method high order function in a particular http method
 * @typedef {(route: String, handler: String, validator: BaseValidator = new BaseValidator()) => Route} Method
 */

/**
 * Encapsulates the available fun http methods
 *
 * @param {Express.Router}   router       The router that will handle the http calls.
 * @param {BaseController}   controller   The controller that will handle the http resources.
 *
 * @returns {{
 *   methods: String[]
 *   post: Method,
 *   get: Method,
 *   put: Method,
 *   patch: Method,
 *   delete: Method
 * }} An object of http methods and the list of available methods
 */
const http = (router, controller) => ({
  methods: ['post', 'get', 'put', 'patch', 'delete'],
  post: R.curry(method(router, controller)('post')),
  get: R.curry(method(router, controller)('get')),
  put: R.curry(method(router, controller)('put')),
  patch: R.curry(method(router, controller)('patch')),
  delete: R.curry(method(router, controller)('delete'))
});

module.exports = http;
