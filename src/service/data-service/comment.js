'use strict';

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  create(postId, comment) {
    return this._Comment.create({
      postId,
      ...comment
    });
  }

  findAll(postId) {
    return this._Comment.findAll({
      where: {postId},
      raw: true
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
