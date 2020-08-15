/**
 * Base repository representation.
 *
 * @since      0.1.0
 * @access     public
 *
 * @constructs BaseRepository
 */
class BaseRepository {
  /**
   * Repository Model.
   *
   * @since  0.1.0
   * @access protected
   *
   * @type     {Model}
   *
   * @member   {Model} model
   * @memberof BaseRepository
   */
  model = undefined;

  /**
   * BaseRepository constructor
   *
   * @since      0.1.0
   * @access     public
   *
   * @constructs BaseRepository
   *
   * @param {Model} model The model that the repository will handle.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Gets all the instances of the model.
   *
   * @since      0.1.0
   * @access     public
   * @memberof BaseRepository
   *
   * @returns {Array[Model]} A collection of models.
   */
  async all() {
    return await this.model.findAll();
  }

  /**
   * Creates an instance of the model.
   *
   * @since      0.1.0
   * @access     public
   * @memberof BaseRepository
   *
   * @param {Object} data The data to feed to the new model instance.
   *
   * @returns {Model} A model instance.
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Updates an instance of the model.
   *
   * @since      0.1.0
   * @access     public
   * @memberof BaseRepository
   *
   * @param {Object} data The data to feed to the model instance.
   * @param {Number} id   The id of the model instance.
   *
   * @returns {Array[Number]} A singleton array that holds the number of affected rows.
   */
  async update(id, data) {
    return await this.model.update(data, { where: { id: id } });
  }

  /**
   * Deletes an instance of the model.
   *
   * @since      0.1.0
   * @access     public
   * @memberof BaseRepository
   *
   * @param {Number} id The id of the model instance.
   *
   * @returns {Number} The number of affected rows.
   */
  async delete(id) {
    return await this.model.destroy({ where: { id: id } });
  }

  /**
   * Shows an instance of the model.
   *
   * @since      0.1.0
   * @access     public
   * @memberof BaseRepository
   *
   * @param {Number} id The id of the model instance.
   *
   * @returns {Model} A model instance.
   */
  async show(id) {
    return await this.model.findOne({ where: { id: id } });
  }
}

module.exports = BaseRepository;
