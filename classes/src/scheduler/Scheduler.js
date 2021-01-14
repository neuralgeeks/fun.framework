const R = require('ramda');
const CronJob = require('cron').CronJob;
const Logger = require('../../Logger');
const logger = new Logger();
const colors = {
  reset: '\x1b[0m',
  bfScheduler: '\u001b[34;1m',
  bfSchedule: '\u001b[36;1m',
  bfMethod: '\u001b[35;1m'
};

const BaseSchedule = require('./BaseSchedule');

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
 * An application Scheduler representation
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs Scheduler
 */
class Scheduler {
  /**
   * Returns the schedules configurated for the application Scheduler.
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Scheduler
   *
   * @returns    {[BaseSchedule]}   The configurated schedules for the application.
   */
  schedules() {
    return [];
  }

  /**
   * Starts the application scheduler.
   *
   * This method should be final.
   *
   * @since      0.1.0
   * @access     public
   * @memberof   Scheduler
   */
  start() {
    R.forEach((schedule) => {
      this.scheduleTimeout(schedule);
      this.scheduleInterval(schedule);
      this.scheduleCron(schedule);
    }, this.schedules());
  }

  /**
   * Schedules an schedule javascript interval if needed
   *
   * @since      0.1.0
   * @access     private
   * @memberof   Scheduler
   *
   * @param {BaseSchedule} schedule
   */
  scheduleInterval(schedule) {
    if (!schedule.interval) return;

    setInterval(() => {
      logger.info(
        colors.bfScheduler +
          'SCHEDULER' +
          colors.reset +
          ' Executing ' +
          colors.bfSchedule +
          schedule.name +
          colors.reset +
          ' scheduled' +
          colors.bfMethod +
          ' interval' +
          colors.reset +
          ' callback'
      );
      schedule.intervalCallback();
    }, schedule.interval);
  }

  /**
   * Schedules an schedule cronjob if needed
   *
   * @since      0.1.0
   * @access     private
   * @memberof   Scheduler
   *
   * @param {BaseSchedule} schedule
   */
  scheduleCron(schedule) {
    if (!schedule.cron) return;

    let job = new CronJob(schedule.cron, () => {
      logger.info(
        colors.bfScheduler +
          'SCHEDULER' +
          colors.reset +
          ' Executing ' +
          colors.bfSchedule +
          schedule.name +
          colors.reset +
          ' scheduled' +
          colors.bfMethod +
          ' cronjob' +
          colors.reset +
          ' callback'
      );
      schedule.cronCallback();
    });
    job.start();
  }

  /**
   * Schedules an schedule javascript timeout if needed
   *
   * @since      0.1.0
   * @access     private
   * @memberof   Scheduler
   *
   * @param {BaseSchedule} schedule
   */
  scheduleTimeout(schedule) {
    if (!schedule.timeout) return;

    setTimeout(() => {
      logger.info(
        colors.bfScheduler +
          'SCHEDULER' +
          colors.reset +
          ' Executing ' +
          colors.bfSchedule +
          schedule.name +
          colors.reset +
          ' scheduled' +
          colors.bfMethod +
          ' timeout' +
          colors.reset +
          ' callback'
      );
      schedule.timeoutCallback();
    }, schedule.timeout);
  }
}

module.exports = Scheduler;
