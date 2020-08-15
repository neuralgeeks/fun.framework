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
