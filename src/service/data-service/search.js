'use strict';

const {Op} = require(`sequelize`);
const Alias = require(`../models/alias`);

class SearchService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
  }

  async findAll(searchText) {
    try {
      const posts = await this._Post.findAll({
        where: {
          title: {
            [Op.substring]: searchText
          }
        },
        include: [Alias.CATEGORIES],
        order: [
          [`createdAt`, `DESC`]
        ]
      });

      return posts.map((post) => post.get());
    } catch (err) {
      return null;
    }
  }
}

module.exports = SearchService;
