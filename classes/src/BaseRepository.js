const autoBind = require('auto-bind');

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
 * Base repository representation.
 */
class BaseRepository {
  /**
   * Repository Model.
   *
   * @access protected
   *
   * @type     {Model}
   */
  model = undefined;

  /**
   * BaseRepository constructor
   *
   * @param {Model} model The model that the repository will handle.
   */
  constructor(model) {
    autoBind(this);
    this.model = model;
  }

  /**
   * Gets all the instances of the model.
   *
   * @returns {Model[]} A collection of models.
   */
  async all() {
    return this.model.findAll();
  }

  /**
   * Creates an instance of the model.
   *
   * @param {Object} data The data to feed to the new model instance.
   *
   * @returns {Model} A model instance.
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Updates an instance of the model.
   *
   * @param {Object} data The data to feed to the model instance.
   * @param {any} id   The id of the model instance.
   *
   * @returns {[Number]} A singleton array that holds the number of affected rows.
   */
  async update(id, data) {
    return this.model.update(data, { where: { id: id } });
  }

  /**
   * Deletes an instance of the model.
   *
   * @param {any} id The id of the model instance.
   *
   * @returns {Number} The number of affected rows.
   */
  async delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

  /**
   * Shows an instance of the model.
   *
   * @param {any} id The id of the model instance.
   *
   * @returns {Model} A model instance.
   */
  async show(id) {
    return this.model.findOne({ where: { id: id } });
  }

  /**
   * Gets a paginated section of the model instances.
   *
   * @param {number} perPage The number of instances per page.
   * @param {number} [currentPage] The current page.
   * @param {[string, string][]} [order] Sequelize-like order array.
   *
   * @returns {{
   *  data: Model[],
   *  last: number,
   *  next: number,
   *  prev: number
   * }} The current page data with pagination data.
   */
  async paginate(perPage, currentPage = 1, order = [['createdAt', 'ASC']]) {
    currentPage = Number(currentPage);

    const result = await this.model.findAndCountAll({
      order,
      limit: perPage,
      offset: (currentPage - 1) * perPage
    });

    const lastPage = Math.ceil(result.count / perPage);
    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;

    return {
      data: result.rows,
      last: lastPage,
      next: (nextPage <= lastPage && nextPage) || undefined,
      prev: (prevPage > 0 && prevPage) || undefined
    };
  }
}

module.exports = BaseRepository;
