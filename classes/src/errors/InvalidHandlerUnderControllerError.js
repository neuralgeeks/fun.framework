const BaseError = require('../BaseError');

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
 * InvalidHandlerUnderControllerError representation.
 */
class InvalidHandlerUnderControllerError extends BaseError {
  constructor(handlerMethodName, controller) {
    let feed = {
      status: 500,
      title: 'invalidHandlerUnderController',
      detail: `${handlerMethodName} handler does not exist under controller or it is not a callable function`,
      meta: {
        controller: controller.constructor.name
      }
    };
    super(feed);
  }
}

module.exports = InvalidHandlerUnderControllerError;
