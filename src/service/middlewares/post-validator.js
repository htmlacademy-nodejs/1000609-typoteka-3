'use strict';

const {HttpCode} = require(`../../constants`);

const postKeys = [`category`, `announce`, `fullText`, `title`, `createdDate`];

module.exports = (req, res, next) => {
  const newPost = req.body;
  const keys = Object.keys(newPost);
  const keysExists = postKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
