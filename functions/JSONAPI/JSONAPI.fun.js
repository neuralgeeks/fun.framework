const R = require('ramda');
const BaseError = require('../../classes/src/BaseError');
const errorFun = require('../general/errors.fun');

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
 * High order funtion that given an ``Express.Response`` and a status code returns a function
 * that transforms and send data to the response using the data JSONAPI standard
 *
 * @param {Express.Response}      res      The response that will handle the data send
 * @param {Number}                code     The status to code of the handled response
 *
 * @returns {(data: any, transformFunction: ((input: any) => any),
 *            extra: { meta: any | undefined, links: any | undefined} = {}) => void}
 *          A function that transforms and send data to the response using the data JSONAPI standard.
 *          The ``transformFunction`` parameter of this function is by default the identity function.
 */
const data =
  (res, code) =>
  async (data, transformFunction = (item) => item, { meta, links } = {}) => {
    // validating transform
    if (typeof transformFunction === 'function') {
      // transforming
      let transformed = await transformFunction(data);
      let document = {
        data: transformed
      };

      // adding optionals
      if (links) document.links = links;
      if (meta) document.meta = meta;

      // sending response
      res.status(code).json(document);
    } else
      errorFun.throw(
        null,
        res,
        new BaseError({
          status: 500,
          title: 'invalidTransformFunction',
          detail: 'invalid transform function for JSONAPI response',
          meta: {
            JSONAPIMethod: 'data'
          }
        })
      );
  };

/**
 * High order funtion that given an ``Express.Response`` and a status code returns a function
 * that transforms and send paginated data to the response using the data JSONAPI standard
 *
 * @param {Express.Response}      res      The response that will handle the data send
 * @param {Number}                code     The status to code of the handled response
 *
 * @returns {(paginated: {data: any, last: number, next: number | undefined, prev: number | undefined},
 *            transformFunction: ((input: any) => any),
 *            extra: { meta: any | undefined, links: any | undefined} = {}) => void}
 *          A function that transforms and send paginated data to the response using the data JSONAPI standard.
 *          The ``transformFunction`` parameter of this function is by default the identity function.
 */
const pagination =
  (res, code) =>
  (
    { data: pageData, last, next, prev },
    transformFunction = (item) => item,
    { meta, links } = {}
  ) =>
    data(res, code)(pageData, transformFunction, {
      meta,
      links: { ...links, pagination: { first: 1, last, next, prev } }
    });

/**
 * High order funtion that given an ``Express.Response`` and a status code returns a function
 * that sends to the response a JSONAPI only meta standard response
 *
 * @param {Express.Response}      res      The response that will handle the data send
 * @param {Number}                code     The status to code of the handled response
 *
 * @returns {(meta: any) => void}
 *          A function that sends to the response a JSONAPI only meta standard response
 */
const meta = (res, code) => (meta) => {
  res.status(code).json({ meta: meta });
};

/**
 * High order funtion that given an ``Express.Response`` and a status code returns a function
 * that sends a reference to a resource to the response using the JSONAPI standard
 *
 * @param {Express.Response}      res      The response that will handle the data send
 * @param {Number}                code     The status to code of the handled response
 *
 * @returns {(id: Number,
 *            type: String,
 *            extra: {
 *              meta: any | undefined,
 *              links: any | undefined,
 *              dataAttr: any | undefined
 *            } = {}) => void }
 *          A function that sends a reference to a resource to the response using JSONAPI standard.
 *          The ``dataAttr`` optional attribute of extra gets merged to the data object of the JSONAPI response.
 */
const reference =
  (res, code) =>
  (id, type, { meta, links, dataAttr } = {}) => {
    let document = {
      data: {
        id: id,
        type: type,
        links: { self: '/' + type + '/' + id }
      }
    };

    // adding optionals
    if (meta) document.meta = meta;
    if (links) document.links = links;
    if (dataAttr && typeof dataAttr === 'object')
      document.data = R.mergeRight(document.data, dataAttr);

    // sending response
    res.status(code).json(document);
  };

module.exports = (res, code) => ({
  data: data(res, code),
  meta: meta(res, code),
  reference: reference(res, code),
  pagination: pagination(res, code)
});
