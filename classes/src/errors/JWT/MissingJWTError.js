const BaseError = require('../../BaseError');

class MissingJWTError extends BaseError {
  constructor() {
    let feed = {
      status: 400,
      title: 'missingJWT',
      detail: 'Bad request, there was no authorization JWT specified'
    };
    super(feed);
  }
}

module.exports = MissingJWTError;
