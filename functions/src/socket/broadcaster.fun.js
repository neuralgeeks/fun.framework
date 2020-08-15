const BaseRule = require('../../../classes/src/BaseRule');

/**
 * Returns the representation of a broadcasting channel
 *
 * @since  0.1.0
 *
 * @param {string}       name    The channel name.
 * @param {[BaseRule]}   [rules]  The channel subscription rules.
 *
 * @returns {{name: string, rules: [BaseRule]} The application arguments.
 */
let channel = (name, rules = []) => {
  return { name: name, rules: rules };
};

module.exports.channel = channel;
