const BaseError = require('../BaseError');

class GenericInternalServerError extends BaseError {
  constructor({ meta = {}, detail = 'The server encountered an exception.' }) {
    let feed = {
      status: 500,
      title: 'internalServerError',
      detail: detail,
      meta: meta
    };
    super(feed);
  }
}

module.exports = GenericInternalServerError;
