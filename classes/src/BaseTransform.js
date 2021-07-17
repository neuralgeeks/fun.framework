const R = require('ramda');
const autoBind = require('auto-bind');

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
 * Base transform representation.
 */
class BaseTransform {
  /**
   * BaseTransform constructor
   */
  constructor() {
    autoBind(this);
  }

  /**
   * Morph an object into another based on the transformer rule
   *
   * @param      {Object}          object The object to be morphed
   *
   * @returns    {Object}          The morphed object
   */
  morph(object) {
    return object;
  }

  /**
   * Morph a single object into another using the morph transformer rule.
   * This method should be final
   *
   * @param      {Object}          item The object to be morphed
   *
   * @returns    {Object}          The morphed object
   */
  item(item) {
    return this.morph(item);
  }

  /**
   * Morph an iterable collection of object into another iterable collection of objects
   * using the morph transformer rule. This method should be final
   *
   * @param      {Object[]}          collection The collection to be morphed
   *
   * @returns    {Object[]}          The morphed collection
   */
  collection(collection) {
    return R.map((item) => this.morph(item), collection);
  }

  /**
   * Morph either a single object into another object or an iterable collection of objects
   * into another iterable collection of objects. Using the morph transformer rule.
   * This method should be final
   *
   * @param      {Object[] | Object}          input The input to be morphed
   *
   * @returns    {Object[] | Object}          The morphed object / collection
   */
  arbitrary(input) {
    return Array.isArray(input) ? this.collection(input) : this.item(input);
  }
}

module.exports = BaseTransform;
