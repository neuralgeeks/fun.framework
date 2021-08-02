const httpProxy = require('http-proxy');
const R = require('ramda');

const errorFun = require('../../../general/errors.fun');
const Errors = require('../../../../classes/src/errors');
const GenericInternalServerError = require('../../../../classes/src/errors/GenericInternalServerError');
const BaseService = require('../../../../classes/src/BaseService');

/**
 * @license
 * Copyright 2021 neuralgeeks LLC.
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
 * @typedef {(middleware: Middleware[] = []) => void} Route
 */

/**
 * A fun gateway, product of a evaluation of the fun.gateway high order function in a particular router
 * @typedef {(options: {proxy: httpProxy, position: number} = {}) => (services: BaseService[]) => (routes: String[]) => (methods: ('post' | 'get' | 'put' | 'patch' | 'delete')[])  => Route} Gateway
 */

/**
 * Encapsulates a fun service oriented http gateway
 *
 * @param {Express.Router}   router       The router that will handle the requests.
 *
 * @returns {Gateway} A high grade funtion that handles a service oriented http gateway.
 */
const gateway =
  (router) =>
  ({ proxy = httpProxy.createProxyServer(), position = 2 } = {}) =>
  (services) =>
  (routes) =>
  (methods) =>
  (middlewares = []) => {
    const combinations = R.xprod(R.xprod(routes, methods), services);

    R.forEach((combination) => {
      const [[route, method], service] = combination;

      router[method](
        `/${service.name}${route}`,
        middlewares,
        async (req, res) => {
          try {
            let [servicePrefix, ...rest] = R.drop(
              position,
              req.originalUrl.split('/')
            );

            if (servicePrefix !== service.name)
              errorFun.throw(
                req,
                res,
                new GenericInternalServerError({
                  detail:
                    'Got invalid service prefix. There might be a misconfiguration of the proxy prefix position.',
                  meta: { expected: service.name, got: servicePrefix }
                })
              );

            let redirect = `${service.url}/${rest.join('/')}`;
            req.headers = { ...req.headers, ...(await service.getHeaders()) };

            if (redirect)
              proxy.web(req, res, {
                target: redirect,
                changeOrigin: true,
                ignorePath: true
              });
            else errorFun.throw(req, res, new Errors.ForbiddenError());
          } catch (err) {
            errorFun.internal(req, res, err);
          }
        }
      );
    }, combinations);
  };

module.exports = gateway;
