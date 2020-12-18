const BaseError = require('../../BaseError');

class BadJWTError extends BaseError {
  constructor(token) {
    let feed = {
      status: 400,
      title: 'badJWT',
      detail: 'The request cannot be authorized due to bad JWT Authorization',
      meta: {
        givenToken: token
      }
    };
    super(feed);
  }
}

module.exports = BadJWTError;
