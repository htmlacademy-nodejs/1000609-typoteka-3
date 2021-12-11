'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {articleId: postId} = req.params;

  try {
    const post = await service.findOne(postId);

    if (!post) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Post with ${postId} not found`);
    }
  } catch (err) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(null);
  }

  return next();
};
