const BaseError = require('../BaseError');

class ExceptionAfterHeadersSentError extends BaseError {
  constructor(method, meta) {
    let feed = {
      status: 500,
      title: 'exceptionAfterHeadersSent',
      detail: `The server triggered an exception using ${method} after the headers were sent, the server is unable to send JSONAPI error response. Please check you code, there may be some inconsistencies.`,
      meta: meta
    };
    super(feed);
  }
}

module.exports = ExceptionAfterHeadersSentError;
