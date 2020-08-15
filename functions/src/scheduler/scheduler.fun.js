const BaseSchedule = require('../../../classes/src/scheduler/BaseSchedule');

/**
 * Returns a new schedule instance given the schedule name and params.
 *
 * @since  0.1.0
 *
 * @param {typeof BaseSchedule}  SheduleClass    The Schedule class to be instanced.
 * @param {String}               name            The schedule name.
 * @param {{
 *    cron: String | undefined,
 *    timeout: Number | undefined,
 *    interval: Number | undefined
 *  }}  params  The schedule frecuency params.
 *
 * @returns {BaseSchedule} The new schedule instance.
 */
let schedule = (SheduleClass, name, params) => {
  return new SheduleClass(name, params);
};

module.exports.schedule = schedule;
