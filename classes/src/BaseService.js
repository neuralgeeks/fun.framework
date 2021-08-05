const R = require('ramda');
const joi = require('joi');
const axios = require('axios');
const autoBind = require('auto-bind');

const BaseError = require('./BaseError');
const GenericInternalServerError = require('./errors/GenericInternalServerError');
const errorFun = require('../../functions/general/errors.fun');

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
 * Joi schema for JSONAPI error responses
 */
const JSONAPIErrorSchema = joi.object().keys({
  errors: joi
    .array()
    .min(1)
    .items(
      joi
        .object()
        .keys({
          id: joi.string(),
          status: joi.number(),
          title: joi.string(),
          description: joi.string(),
          meta: joi.any()
        })
        .unknown()
    )
    .required()
});

/**
 * Service custom axios error handler
 */
const serviceErrorHandler = (req, res, service, route) => (error) => {
  if (!req || !res) throw error.response || error.request || error.message;

  // Case: The service returned a non 2XX code
  if (error.response) {
    // Case: Response is not JSONAPI
    if (!!JSONAPIErrorSchema.validate(error.response.data).error) {
      errorFun.throw(
        req,
        res,
        new BaseError({
          status: error.response.status,
          title: 'serviceRequestError',
          description: `${service} returned an error when calling ${route}`,
          meta: {
            originalError: error.response.data,
            serviceScope: [{ service, route }]
          }
        })
      );
      return;
    }

    // Case: Response is JSONAPI
    let [JSONAPIErrorFeed] = error.response.data.errors;
    JSONAPIErrorFeed.meta = {
      ...JSONAPIErrorFeed.meta,
      serviceScope: [
        ...(JSONAPIErrorFeed.meta.serviceScope || []),
        { service, route }
      ]
    };
    errorFun.throw(req, res, new BaseError(JSONAPIErrorFeed));
  }
  // Case: The service did not responded
  else if (error.request)
    errorFun.throw(
      req,
      res,
      new GenericInternalServerError({
        detail: `${service} did not responded at ${route} request.`,
        meta: { serviceScope: [{ service, route }] }
      })
    );
  // Case: Unexpected error
  else
    errorFun.throw(
      req,
      res,
      new GenericInternalServerError({
        detail: `Something happened while setting up ${service} ${route} request.`,
        meta: { serviceScope: [{ service, route }], message: error.message }
      })
    );
};

/**
 * Base service representation.
 */
class BaseService {
  /**
   * Service name.
   *
   * @access protected
   *
   * @type     {String}
   */
  name = undefined;

  /**
   * Service absolute base URL.
   *
   * @access protected
   *
   * @type     {String}
   */
  url = undefined;

  /**
   * Given express request.
   *
   * @type     {Express.Request | undefined}
   */
  req = undefined;

  /**
   * Given express response.
   *
   * @type     {Express.Response | undefined}
   */
  res = undefined;

  /**
   * BaseRepository constructor
   *
   * @param {String} name The name of the service. This will be used a prefix for gateway redirects.
   * @param {String} url The absolute URL of the service.
   * @param {{req: Express.Request, res: Express.Response}} [express] An object with the request request and response. This is used to automatically catch errors.
   */
  constructor(name, url, { req, res } = {}) {
    autoBind(this);
    this.name = name;
    this.url = url;
    this.req = req;
    this.res = res;
  }

  /**
   * Sends a `method` request to the service at the given `route`. Automatically catches errors.
   *
   * @access protected
   *
   * @param      {String}  method     The request request method
   * @param      {String}  route        The relative route of the request
   * @param      {any}     [options]  Extra axios options
   *
   * @returns    {axios.AxiosPromise} The request promise
   */
  async method(method, route, options) {
    return axios({
      method,
      url: `${this.url}${route}`,
      headers: await this.getHeaders(),
      ...R.omit(['method', 'url'], options)
    }).catch(serviceErrorHandler(this.req, this.res, this.name, route));
  }

  /**
   * Sends a `post` request to the service at the given `route` with the given `data`. Automatically catches errors.
   *
   * @param      {String}  route       The relative route of the request
   * @param      {String}  data        The body data of the request
   * @param      {any}     [options]   Extra axios options
   *
   * @returns    {axios.AxiosPromise} The request promise
   */
  async post(route, data, options = {}) {
    return this.method('post', route, { data, ...options });
  }

  /**
   * Sends a `get` request to the service at the given `route`. Automatically catches errors.
   *
   * @param      {String}  route       The relative route of the request
   * @param      {any}     [options]   Extra axios options
   *
   * @returns    {axios.AxiosPromise} The request promise
   */
  async get(route, options = {}) {
    return this.method('get', route, options);
  }

  /**
   * Sends a `put` request to the service at the given `route` with the given `data`. Automatically catches errors.
   *
   * @param      {String}  route       The relative route of the request
   * @param      {any}     data        The body data of the request
   * @param      {any}     [options]   Extra axios options
   *
   * @returns    {axios.AxiosPromise} The request promise
   */
  async put(route, data, options = {}) {
    return this.method('put', route, { data, ...options });
  }

  /**
   * Sends a `patch` request to the service at the given `route` with the given `data`. Automatically catches errors.
   *
   * @param      {String}  route       The relative route of the request
   * @param      {any}     data        The body data of the request
   * @param      {any}     [options]   Extra axios options
   *
   * @returns    {axios.AxiosPromise} The request promise
   */
  async patch(route, data, options = {}) {
    return this.method('patch', route, { data, ...options });
  }

  /**
   * Sends a `delete` request to the service at the given `route` with the given `data`. Automatically catches errors.
   *
   * @param      {String}  route       The relative route of the request
   * @param      {any}     [data]      The body data of the request
   * @param      {any}     [options]   Extra axios options
   *
   * @returns    {axios.AxiosPromise} The request promise
   */
  async delete(route, data = {}, options = {}) {
    return this.method('delete', route, { data, ...options });
  }

  /**
   * Returns the default request headers for this service. Override this method with your custom implementation.
   *
   * @returns    {Promise<any>} The default request headers
   */
  async getHeaders() {
    return {};
  }
}

module.exports = BaseService;
