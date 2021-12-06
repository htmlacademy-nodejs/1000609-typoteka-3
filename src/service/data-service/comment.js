'use strict';

const Alias = require(`../models/alias`);

const LAST_COMMENTS_NUMBER = 4;
const LAST_COMMENTS_TEXT_LENGTH = 100;

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(postId, commentData) {
    const comment = await this._Comment.create({
      postId,
      ...commentData
    });

    return comment.get();
  }

  findAll(postId) {
    return this._Comment.findAll({
      where: {postId},
      raw: true
    });
  }

  async findLast() {
    const comments = await this._Comment.findAll({
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      limit: LAST_COMMENTS_NUMBER
    });

    return comments
      .map((comment) => comment.get())
      .map((comment) => {
        if (comment.text.length < LAST_COMMENTS_TEXT_LENGTH) {
          return comment;
        }
        return {
          ...comment,
          text: `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…`
        };
      });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
