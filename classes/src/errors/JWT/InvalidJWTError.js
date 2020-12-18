const BaseError = require('../../BaseError');

class InvalidJWTError extends BaseError {
  constructor(token) {
    let feed = {
      status: 403,
      title: 'invalidJWT',
      detail:
        'The request cannot be authorized, the given JWT was invalid or has expirated',
      meta: {
        givenToken: token
      }
    };
    super(feed);
  }
}

module.exports = InvalidJWTError;
