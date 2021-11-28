'use strict';

const Alias = require(`../models/alias`);

class PostService {
  constructor(sequelize) {
    this._Post = sequelize.models.Post;
    this._PostCategory = sequelize.models.PostCategory;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
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
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const posts = await this._Post.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return posts.map((post) => post.get());
  }

  findOne(id) {
    return this._Post.findByPk(
        id,
        {
          include: [
            Alias.CATEGORIES,
            {
              model: this._Comment,
              as: Alias.COMMENTS,
              include: [
                {
                  model: this._User,
                  as: Alias.USERS,
                  attributes: {
                    exclude: [`passwordHash`]
                  }
                }
              ]
            }
          ]
        }
    );
  }

  async findPage({limit, offset, categoryId}) {
    const {count, rows} = await this._Post.findAndCountAll({
      limit,
      offset,
      include: [
        Alias.CATEGORIES,
        ...(categoryId ? [{
          model: this._PostCategory,
          as: Alias.POST_CATEGORIES,
          where: {
            CategoryId: categoryId
          }
        }] : []),
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          include: [
            {
              model: this._User,
              as: Alias.USERS,
              attributes: {
                exclude: [`passwordHash`]
              }
            }
          ]
        }
      ],
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
