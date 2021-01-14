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
 * Returns the current ISO date string.
 *
 * @since  0.1.0
 *
 * @returns {String} Current ISO date string.
 */
let date = () => {
  let now = new Date();
  let month = (now.getUTCMonth() + 1).toString();
  let day = now.getUTCDay().toString();

  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }

  return now.getUTCFullYear() + '-' + month + '-' + day;
};

/**
 * Returns the current ISO datetime string.
 *
 * @since  0.1.0
 *
 * @returns {String} Current ISO datetime string.
 */
let datetime = () => {
  let now = new Date();
  let month = (now.getUTCMonth() + 1).toString();
  let day = now.getUTCDate().toString();
  let hour = now.getUTCHours().toString();
  let minute = now.getUTCMinutes().toString();
  let second = now.getUTCSeconds().toString();

  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  if (hour.length === 1) {
    hour = '0' + hour;
  }
  if (minute.length === 1) {
    minute = '0' + minute;
  }
  if (second.length === 1) {
    second = '0' + second;
  }

  return (
    now.getUTCFullYear() +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hour +
    ':' +
    minute +
    ':' +
    second
  );
};

module.exports.date = date;
module.exports.datetime = datetime;
