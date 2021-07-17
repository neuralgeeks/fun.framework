const moment = require('moment');
const env = process.env.NODE_ENV || 'development';

const colors = {
  reset: '\x1b[0m',
  fgCyan: '\x1b[36m',
  fgMagenta: '\x1b[35m',
  fgGreen: '\x1b[32m',
  fgRed: '\x1b[31m',
  fgYellow: '\u001b[33m'
};

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
 * Customized Logger.
 *
 * This class is an enhancement of `console.log`,
 * it provides better logging and also supports microservice logging
 */
class Logger {
  /**
   * The service logging name
   *
   * @type     {String}
   */
  static name = 'server';

  /**
   * Whether debug is active or not
   *
   * @type     {Boolean}
   */
  static debug = true;

  /**
   * Whether error is active or not
   *
   * @type     {Boolean}
   */
  static error = true;

  /**
   * Whether info is active or not
   *
   * @type     {Boolean}
   */
  static info = true;

  /**
   * Logger constructor.
   *
   * Constructs a logger and sets the service logger name if given.
   *
   * @param {String} [name] The new service name.
   * @param {{debug: Boolean, info: Boolean, error: Boolean}} [level] Whether each logger level is active or not.
   */
  constructor(name, { debug, info, error } = {}) {
    if (name) Logger.name = name;
    if (debug) Logger.debug = debug;
    if (info) Logger.info = info;
    if (error) Logger.error = error;
  }

  /**
   * Writes a message into the info logging channel.
   *
   * @param {String} message The message to write.
   */
  info(message) {
    if (env === 'test' || !Logger.info) return;

    console.log(
      [
        `${colors.fgMagenta}${moment().toISOString()}${colors.reset}`,
        `- ${colors.fgCyan}${Logger.name}${colors.reset}`,
        `- ${colors.fgGreen}INFO${colors.reset}:`
      ].join(' '),
      message
    );
  }

  /**
   * Writes a message into the debug logging channel.
   *
   * @param {String} message The message to write.
   */
  debug(message) {
    if (env === 'test' || !Logger.debug) return;

    console.log(
      [
        `${colors.fgMagenta}${moment().toISOString()}${colors.reset}`,
        `- ${colors.fgCyan}${Logger.name}${colors.reset}`,
        `- ${colors.fgYellow}DEBUG${colors.reset}:`
      ].join(' '),
      message
    );
  }

  /**
   * Writes an error into the error logging channel.
   *
   * @param {String} error The error to write.
   */
  error(error) {
    if (env === 'test' || !Logger.error) return;

    console.log(
      [
        `${colors.fgMagenta}${moment().toISOString()}${colors.reset}`,
        `- ${colors.fgCyan}${Logger.name}${colors.reset}`,
        `- ${colors.fgRed}ERROR${colors.reset}:`
      ].join(' '),
      error
    );
  }
}

module.exports = Logger;
