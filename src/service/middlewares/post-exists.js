'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {postId} = req.params;
  const post = service.findOne(postId);

  if (!post) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Post with ${postId} not found`);
  }

  res.locals.post = post;
  return next();
};
