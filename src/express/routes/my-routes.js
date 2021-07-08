'use strict';

const {Router} = require(`express`);
const {formatDate, formatDatetime} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`user/my`, {posts, formatDate, formatDatetime});
});
myRouter.get(`/comments`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`user/comments`, {posts: posts.slice(0, 3), formatDate, formatDatetime});
});

module.exports = myRouter;
