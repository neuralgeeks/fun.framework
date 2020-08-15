const R = require('ramda');
const BaseError = require('../../classes/src/BaseError');
const errorFun = require('../general/errors.fun');

/**
 * High order funtion that given an Express.Response and a status code returns a function
 * that transforms and send data to the response using the data JSONAPI standard
 *
 * @since  0.1.0
 *
 * @param {Express.Response}      res      The response that will handle the data send
 * @param {Number}                code     The status to code of the handled response
 *
 * @returns {(data: any, transformFunction: ((input: any) => any),
 *            extra: { meta: any | undefined, links: any | undefined} | undefined) => void}
 *          A function that transforms and send data to the response using the data JSONAPI standard.
 *          The transformFunction parameter of this function is by default the identity function.
 */
let data = (res, code) => {
  return (data, transformFunction = (item) => item, { meta, links } = {}) => {
    // validating transform
    if (typeof transformFunction === 'function') {
      // transforming
      let transformed = transformFunction(data);
      let document = {
        data: transformed
      };

      // adding optionals
      if (links) document.links = links;
      if (meta) document.meta = meta;

      // sending response
      res.status(code).json(document);
    } else {
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
    }
  };
};

/**
 * High order funtion that given an Express.Response and a status code returns a function
 * that sends to the response a JSONAPI only meta standard response
 *
 * @since  0.1.0
 *
 * @param {Express.Response}      res      The response that will handle the data send
 * @param {Number}                code     The status to code of the handled response
 *
 * @returns {(meta: any) => void}
 *          A function that sends to the response a JSONAPI only meta standard response
 */
let meta = (res, code) => {
  return (meta) => {
    res.status(code).json({ meta: meta });
  };
};

/**
 * High order funtion that given an Express.Response and a status code returns a function
 * that sends a reference to a resource to the response using the JSONAPI standard
 *
 * @since  0.1.0
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
 *            } | undefined) => void }
 *          A function that sends a reference to a resource to the response using JSONAPI standard.
 *          The dataAttr optional attribute of extra gets merged to the data object of the JSONAPI response.
 */
let reference = (res, code) => {
  return (id, type, { meta, links, dataAttr } = {}) => {
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
};

module.exports = (res, code) => {
  return {
    data: data(res, code),
    meta: meta(res, code),
    reference: reference(res, code)
  };
};
