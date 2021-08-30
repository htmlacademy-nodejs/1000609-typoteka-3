'use strict';

const Alias = require(`../models/alias`);

class PostService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
  }

  async create(postData) {
    const post = await this._Post.create(postData);
    await post.addCategories(postData.categories);
    return post.get();
  }

  async findAll(needCategories, needComments) {
    const include = [];

    if (needCategories) {
      include.push(Alias.CATEGORIES);
    }

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    const posts = await this._Post.findAll({include});
    return posts.map((post) => post.get());
  }

  findOne(id) {
    return this._Post.findByPk(id, {include: [Alias.CATEGORIES, Alias.COMMENTS]});
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Post.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, posts: rows};
  }

  async update(id, post) {
    const [affectedRows] = await this._Post.update(post, {
      where: {id}
    });
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Post.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = PostService;
