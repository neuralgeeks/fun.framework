const Logger = require('../Logger');
const logger = new Logger();

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
 * Base rule representation.
 */
class BaseRule {
  /**
   * Rule human readable name
   *
   * @type     {String}
   */
  name = 'BaseRule';

  /**
   * Parses and validates the body and evaluates the rule predicate.
   *
   * This method should be final
   *
   * @param      {any}      data     The data to parse the body from.
   *
   * @returns    {boolean}           The rule's evaluation result.
   */
  async eval(data) {
    try {
      let body = await this.body(data);
      if (await this.debug()) {
        logger.debug(`${this.name} body evaluation returned: `);
        logger.debug(body);
      }

      let result = await this.predicate(body);
      if (await this.debug())
        logger.debug(`${this.name} evaluation returned ${result}`);

      return result;
    } catch (e) {
      if (await this.debug()) {
        logger.debug(`Exception raised while evaluating ${this.name}`);
        logger.debug(e);
        logger.debug(`${this.name} evaluation returned false`);
      }
      return false;
    }
  }

  /**
   * Parses and validates the body of the rule from a data object.
   *
   * The output of this method will be used to evaluate the rule predicate.
   * If this method throws an error, the body gets invalidated and thus the rule predicate.
   *
   * @param      {any}      data  The data to parse the body from.
   *
   * @throws     {any}
   * @returns    {any}            The rules body
   */
  async body(data) {
    return data;
  }

  /**
   * Parses and validates the body of the rule from a data object.
   *
   * The output of this method will be used to evaluate the rule predicate.
   * If this method throws an error, the body gets invalidated and thus the rule predicate.
   *
   * @param      {any}      data  The data to parse the body from.
   *
   * @returns    {boolean}         The predicate's output
   */
  async predicate(body) {
    return true;
  }

  /**
   * Returns wheter or not the rule should debug it's evaluation process.
   *
   * @param      {any}      data  The data to parse the body from.
   *
   * @returns    {boolean}        Wheter or not the rule should debug it's evaluation process.
   */
  async debug() {
    return false;
  }
}

module.exports = BaseRule;
