'use strict';

const {Router} = require(`express`);
const {formatDate, formatDatetime} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`user/my`, {posts, formatDate, formatDatetime});
});
myRouter.get(`/comments`, (req, res) => res.render(`user/comments`));

module.exports = myRouter;
