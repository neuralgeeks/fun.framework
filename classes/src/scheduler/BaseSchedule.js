const cronValidator = require('cron-validator');
const Logger = require('../../Logger');
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
 * Base schedule representation.
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs BaseSchedule
 */
class BaseSchedule {
  /**
   * BaseSchedule constructor.
   *
   * The cron, timeout and interval params determine whether the schedule should manage
   * a javascript timeout, a cronjob or a javascript interval. This is not exclusive,
   * a Schedule could handle a cronjob and a javascript timeout.
   *
   * timeout and interval are expresed in miliseconds and cron is a valid cronjob string with seconds support.
   *
   * @since      0.1.0
   * @access     public
   *
   * @constructs BaseSchedule
   *
   * @param {String} name The schedule name.
   * @param {{
   *    cron: String | undefined,
   *    timeout: Number | undefined,
   *    interval: Number | undefined
   *  }} params The frecuency parameters of the schedule.
   */
  constructor(name, { cron, timeout, interval }) {
    this.name = name ? name : 'BaseSchedule';
    this.cron = this.validateCronPattern(cron);
    this.timeout = this.validateTimeout(timeout);
    this.interval = this.validateInterval(interval);
  }

  /**
   * The schedule cronjob callback
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseSchedule
   */
  async cronCallback() {}

  /**
   * The schedule javascript interval callback
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseSchedule
   */
  async intervalCallback() {}

  /**
   * The schedule javascript timeout callback
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseSchedule
   */
  async timeoutCallback() {}

  /**
   * Validates the cronjob cron string.
   *
   * @since      0.1.0
   * @access     private
   * @memberof   BaseSchedule
   *
   * @param      {String | undefined} cron the cron string to validate
   *
   * @returns    {String | null}  the validated cron, null if is not valid
   */
  validateCronPattern(cron) {
    if (!cron) return null;

    // warn if invalid
    if (!cronValidator.isValidCron(cron, { seconds: true })) {
      logger.error(
        'Found invalid cron value for ' +
          this.name +
          ', cronjob will never be executed'
      );
      return null;
    }
    return cron;
  }

  /**
   * Validates the schedule javascript timeout time.
   *
   * @since      0.1.0
   * @access     private
   * @memberof   BaseSchedule
   *
   * @param      {Number | undefined} timeout the timeout to validate
   *
   * @returns    {Number | null}  the validated timeout, null if is not valid
   */
  validateTimeout(timeout) {
    if (!timeout) return null;

    // warn if invalid
    if (isNaN(timeout)) {
      logger.error(
        'Found NaN timeout for ' +
          this.name +
          ', timeout will never be executed'
      );
      return null;
    }
    return timeout;
  }

  /**
   * Validates the schedule javascript interval time.
   *
   * @since      0.1.0
   * @access     private
   * @memberof   BaseSchedule
   *
   * @param      {Number | undefined} interval the interval to validate
   *
   * @returns    {Number | null}  the validated interval, null if is not valid
   */
  validateInterval(interval) {
    if (!interval) return null;

    // warn if invalid
    if (isNaN(interval)) {
      logger.error(
        'Found NaN interval for ' +
          this.name +
          ', interval will never be executed'
      );
      return null;
    }
    return interval;
  }
}

module.exports = BaseSchedule;
