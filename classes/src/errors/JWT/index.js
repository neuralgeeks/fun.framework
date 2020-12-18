const BadJWTError = require('./BadJWTError');
const MissingJWTError = require('./MissingJWTError');
const InvalidJWTError = require('./InvalidJWTError');

module.exports = {
  BadJWTError: BadJWTError,
  MissingJWTError: MissingJWTError,
  InvalidJWTError: InvalidJWTError
};
