/**
 * @license
 * Copyright 2021 neuralgeeks LLC.
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
 * Base identifier representation.
 */
class BaseIdentifier {
  /**
   * Parses the body of the identifier from a data object.
   *
   * The output of this method will be used to resolve the client identity.
   *
   * @param      {any}      data  The data to parse the body from.
   * @returns    {any}            The identifier parsed body.
   */
  async body(data) {
    return data;
  }

  /**
   * Returns the assigned identifier of a client given it's body.
   *
   * @param      {any}      body  The parsed body.
   *
   * @returns    {string}         The assigned identifier.
   */
  async identify(body) {
    return '';
  }

  /**
   * Parses the body and evaluates the identifier.
   *
   * This method should be final
   *
   * @param      {any}      data     The data to parse the body from.
   *
   * @returns    {string}           The assigned identifier.
   */
  async resolveIdentity(data) {
    let body = await this.body(data);
    return await this.identify(body);
  }
}

module.exports = BaseIdentifier;
