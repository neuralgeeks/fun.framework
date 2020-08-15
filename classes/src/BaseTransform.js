const R = require('ramda');
const autoBind = require('auto-bind');

/**
 * Base transform representation.
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs BaseTransform
 */
class BaseTransform {
  /**
   * BaseTransform constructor
   *
   * @since      0.1.0
   * @access     public
   *
   * @constructs BaseTransform
   */
  constructor() {
    autoBind(this);
  }

  /**
   * Morph an object into another based on the transformer rule
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseTransform
   *
   * @param      {Object}          object The object to be morphed
   *
   * @returns    {Object}          The morphed object
   */
  morph(object) {
    return object;
  }

  /**
   * Morph a single object into another using the morph transformer rule.
   * This method should be final
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseTransform
   *
   * @param      {Object}          item The object to be morphed
   *
   * @returns    {Object}          The morphed object
   */
  item(item) {
    return this.morph(item);
  }

  /**
   * Morph an iterable collection of object into another iterable collection of objects
   * using the morph transformer rule. This method should be final
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseTransform
   *
   * @param      {Object}          collection The collection to be morphed
   *
   * @returns    {Object}          The morphed object
   */
  collection(collection) {
    return R.map((item) => this.morph(item), collection);
  }

  /**
   * Morph either a single object into another object or an iterable collection of objects
   * into another iterable collection of objects. Using the morph transformer rule.
   * This method should be final
   *
   * @since      0.1.0
   * @access     public
   * @memberof   BaseTransform
   *
   * @param      {Object}          input The input to be morphed
   *
   * @returns    {Object}          The morphed object / collection
   */
  arbitrary(input) {
    return Array.isArray(input) ? this.collection(input) : this.item(input);
  }
}

module.exports = BaseTransform;
