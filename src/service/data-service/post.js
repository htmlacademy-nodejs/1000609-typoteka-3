'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

const POPULAR_POSTS_NUMBER = 4;
const POPULAR_POSTS_ANNOUNCEMENT_LENGTH = 100;

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

  async findPopular() {
    const posts = await this._Post.findAll({
      subQuery: false,
      include: {
        model: this._Comment,
        as: Alias.COMMENTS,
        attributes: [],
      },
      attributes: {
        include: [
          [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      group: [`Post.id`],
      order: [
        [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `DESC`]
      ],
      limit: POPULAR_POSTS_NUMBER
    });

    return posts
      .map((post) => post.get())
      .filter((post) => post.commentsCount > 0)
      .map((post) => {
        if (post.announcement.length < POPULAR_POSTS_ANNOUNCEMENT_LENGTH) {
          return post;
        }
        return {
          ...post,
          announcement: `${post.announcement.slice(0, POPULAR_POSTS_ANNOUNCEMENT_LENGTH).trim()}…`
        };
      });
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
          ],
          order: [
            [Alias.COMMENTS, `createdAt`, `DESC`]
          ],
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
