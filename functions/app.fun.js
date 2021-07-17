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
 * Parses the main process arguments to obtain app related parameter.
 *
 * @param {NodeJS.Process} process The application main process.
 *
 * @returns {Object} The application arguments.
 */
const parseArgs = (process) => {
  let [name, port, listen] = process.argv.slice(2);
  return { name: name, port: port, listen: Boolean(listen) };
};

/**
 * Starts the given server.
 *
 * @param {NodeJS.http.Server} server    The http server to start.
 * @param {String}             name      The server name.
 * @param {String}             port      The server port.
 * @param {Logger}             [logger]  The application logging object.
 * @param {Boolean}            [listen]  A boolean that indicates if the server should start listing
 */
const start = (server, name, port, logger, listen) => {
  if (port && listen)
    server.listen(port, () =>
      (logger || console).info(`${name} service started in port ${port}`)
    );
};

module.exports = { parseArgs, start };
