'use strict';

const {HttpCode} = require(`../../constants`);

const postKeys = [
  {name: `title`, required: true, min: 30, max: 250},
  {name: `createdAt`, required: true},
  {name: `picture`, required: false},
  {name: `announcement`, required: true, min: 30, max: 250},
  {name: `fullText`, required: false, max: 1000},
  {name: `categories`, required: true}
];

module.exports = (req, res, next) => {
  const newPost = req.body;
  const keys = Object.keys(newPost);
  const keysValid = postKeys.every((key) => {
    if (
      !keys.includes(key.name)
      || key.required && !newPost[key.name]
      || key.min && newPost[key.name].length < key.min
      || key.max && newPost[key.name] && newPost[key.name].length > key.max
    ) {
      return false;
    }
    return true;
  });

  if (!keysValid) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
