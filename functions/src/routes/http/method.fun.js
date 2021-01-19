const Logger = require('../../../../classes/Logger');
const logger = new Logger();
const BaseError = require('../../../../classes/src/BaseError');
const BaseValidator = require('../../../../classes/src/BaseValidator');
const errorFun = require('../../../general/errors.fun');
const BaseController = require('../../../../classes/src/BaseController');

const InvalidHandlerUnderControllerError = require('../../../../classes/src/errors/InvalidHandlerUnderControllerError');

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
 * @typedef {(req: Express.Request, res: Express.Response, next: Middleware) => void} Middleware
 */

/**
 * A fun route, product of a router method high order function
 * @typedef {(middleware: [Middleware] = []) => void} Route
 */

/**
 * A fun method, product of a evaluation of the fun.method high order function in a particular http method
 * @typedef {(route: String, handler: String, validator: BaseValidator = new BaseValidator()) => Route} Method
 */

/**
 * Encapsulates a fun router HTTP method route
 *
 * @since  0.1.0
 *
 * @param {Express.Router}   router       The router that will handle the method.
 * @param {BaseController}   controller   The controller that will handle the resource.
 *
 * @returns {(method: String) => Method } A high grade funtion that handles a http method route.
 */
let method = (router, controller) => {
  return (method) => {
    return (route, handlerMethodName, validator = new BaseValidator()) => {
      return (middlewares = []) => {
        router[method](route, middlewares, async (req, res) => {
          try {
            // get validated params
            logger.info(validator.name + ' validation running');
            let validated = await validator.validate(req, res);
            logger.info('Request is valid, validated by ' + validator.name);

            // call handler
            let handler = controller[handlerMethodName];
            if (handler && typeof handler === 'function') {
              await controller[handlerMethodName](req, res, validated);
              logger.info(
                req.originalUrl + ' response sent with status ' + res.statusCode
              );
            } else {
              errorFun.throw(
                req,
                res,
                new InvalidHandlerUnderControllerError(
                  handlerMethodName,
                  controller
                )
              );
            }
          } catch (err) {
            errorFun.internal(req, res, err);
          }
        });
      };
    };
  };
};

module.exports = method;
