const BaseRule = require('../../../classes/src/BaseRule');
const BaseIdentifier = require('../../../classes/src/BaseIdentifier');

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
 * Returns the representation of a broadcasting channel
 *
 * @param {string}           name          The channel name.
 * @param {BaseRule[]}       [rules]       The channel subscription rules.
 * @param {BaseIdentifier}   [identifier]  The channel identifier instance. This instance will determine which id is assigned to each client.
 *
 * @returns {{name: string, rules: BaseRule[], identifier: BaseIdentifier} The application arguments.
 */
const channel = (name, rules = [], identifier = new BaseIdentifier()) => ({
  name,
  rules,
  identifier
});

module.exports = { channel };
