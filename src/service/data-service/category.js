'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._PostCategory = sequelize.models.PostCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      try {
        const result = await this._Category.findAll({
          attributes: [
            `id`,
            `name`,
            [
              Sequelize.fn(`COUNT`, Sequelize.col(`CategoryId`)), `count`
            ]
          ],
          group: [Sequelize.col(`Category.id`)],
          include: [{
            model: this._PostCategory,
            as: Alias.POST_CATEGORIES,
            attributes: []
          }]
        });

        return result.map((it) => it.get());
      } catch (err) {
        return null;
      }
    }

    return this._Category.findAll({raw: true});
  }

  create(category) {
    return this._Category.create(category);
  }

  async update(id, category) {
    try {
      const [affectedRows] = await this._Category.update(category, {
        where: {id}
      });
      return !!affectedRows;
    } catch (err) {
      return null;
    }
  }

  async drop(id) {
    try {
      const deletedRows = await this._Category.destroy({
        where: {id}
      });
      return !!deletedRows;
    } catch (err) {
      return null;
    }
  }
}

module.exports = CategoryService;
