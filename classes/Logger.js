const winston = require('winston');
const timeFun = require('../functions/general/time.fun');
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
 * This class is an enhancement of @code{console.log},
 * it provides better logging and also support microservice logging
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs Logger
 */
class Logger {
  /**
   * The service logging name
   *
   * @since  0.1.0
   * @access public
   *
   * @type     {String}
   *
   * @member   {String} name
   * @memberof Logger
   */
  static name = 'server';

  /**
   * Wether debbug is active or not
   *
   * @since  0.1.0
   * @access public
   *
   * @type     {Boolean}
   *
   * @member   {Boolean} debug
   * @memberof Logger
   */
  static debug = true;

  /**
   * The winston logger instance.
   *
   * @since  0.1.0
   * @access private
   *
   * @type     {winston.Logger}
   *
   * @member   {winston.Logger} logger
   * @memberof Logger
   */
  #logger = undefined;

  /**
   * Logger constructor.
   *
   * Constructs a logger and sets the service logger name if given.
   *
   * @since      0.1.0
   * @access     public
   *
   * @constructs Logger
   *
   * @param {String} [name] The new service name.
   * @param {Boolean} [debug] Wether debbug is active or not.
   */
  constructor(name, debug) {
    if (name != undefined) {
      Logger.name = name;
    }

    if (debug != undefined) {
      Logger.debug = debug;
    }

    this.logger = winston.createLogger({
      format: winston.format.json(),
      defaultMeta: { service: Logger.name }
    });

    if (env !== 'test') {
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        })
      );

      this.logger.add(
        new winston.transports.File({ filename: 'logs/combined.log' })
      );
    }
  }

  /**
   * Writes a message into the info logging channel.
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Logger
   *
   * @param {String} message The message to write.
   */
  info(message) {
    if (env == 'test') return;

    console.log(
      colors.fgMagenta +
        timeFun.datetime() +
        colors.reset +
        ' - ' +
        colors.fgCyan +
        Logger.name +
        colors.reset +
        ' - ' +
        colors.fgGreen +
        'INFO' +
        colors.reset +
        ':',
      message
    );
    this.logger.info({
      timestamp: timeFun.datetime(),
      message: message
    });
  }

  /**
   * Writes a message into the debug logging channel.
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Logger
   *
   * @param {String} message The message to write.
   */
  debug(message) {
    if (env == 'test' || !Logger.debug) return;

    console.log(
      colors.fgMagenta +
        timeFun.datetime() +
        colors.reset +
        ' - ' +
        colors.fgCyan +
        Logger.name +
        colors.reset +
        ' - ' +
        colors.fgYellow +
        'DEBUG' +
        colors.reset +
        ':',
      message
    );
    this.logger.debug({
      timestamp: timeFun.datetime(),
      message: message
    });
  }

  /**
   * Writes an error into the error logging channel.
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Logger
   *
   * @param {String} error The error to write.
   */
  error(error) {
    if (env == 'test') return;

    console.error(
      colors.fgMagenta +
        timeFun.datetime() +
        colors.reset +
        ' - ' +
        colors.fgCyan +
        Logger.name +
        colors.reset +
        ' - ' +
        colors.fgRed +
        'ERROR' +
        colors.reset +
        ':',
      error
    );
    this.logger.error({
      timestamp: timeFun.datetime(),
      message: error
    });
  }
}

module.exports = Logger;
