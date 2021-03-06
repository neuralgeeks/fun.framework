const { v1: uuid } = require('uuid');
const R = require('ramda');

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
 * Base error representation.
 */
class BaseError {
  /**
   * Unique error identifier.
   *
   * @type     {String}
   */
  id = undefined;

  /**
   * Error JSONAPI Links object
   *
   * @type     {Object | undefined}
   *
   */
  links = undefined;

  /**
   * Error HTTP status code
   *
   * @type     {Number}
   */
  status = 500;

  /**
   * Error custom internal code
   *
   * @type     {String | Number | undefined}
   */
  code = undefined;

  /**
   * Error descriptive title
   *
   * @type     {String}
   */
  title = 'genericInternalServerError';

  /**
   * Error human readable detail string
   *
   * @type     {String | undefined}
   */
  detail = undefined;

  /**
   * Error JSONAPI source object
   *
   * @type     {Object | undefined}
   */
  source = undefined;

  /**
   * Error JSONAPI meta object
   *
   * @type     {Object | undefined}
   */
  meta = {};

  /**
   * BaseError constructor, given a feed Object creates a JSONAPI Error representation
   *
   * @param {Object} feed Feed Object, this objects holds the data to build the error.
   */
  constructor(feed) {
    this.id = uuid();

    R.pipe(
      R.keys,
      R.filter((property) => R.has(property)(this)),
      R.forEach((property) => {
        this[property] = feed[property];
      })
    )(feed);
  }

  /**
   * Gets the JSONAPI compact Object representation of the Error
   *
   * @returns {Object} The JSONAPI compact representation
   */
  compact() {
    return R.pipe(
      R.keys,
      R.filter((property) => this[property]),
      R.map((property) => R.objOf(property, this[property])),
      R.mergeAll
    )(this);
  }
}

module.exports = BaseError;
