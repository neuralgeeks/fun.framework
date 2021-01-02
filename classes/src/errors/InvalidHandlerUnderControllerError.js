const BaseError = require('../BaseError');

class InvalidHandlerUnderController extends BaseError {
  constructor(handlerMethodName, controller) {
    let feed = {
      status: 500,
      title: 'invalidHandlerUnderController',
      detail: `${handlerMethodName} handler does not exist under controller or it is not a callable function`,
      meta: {
        controller: controller
      }
    };
    super(feed);
  }
}

module.exports = InvalidHandlerUnderController;
