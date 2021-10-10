'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const {formatDate, formatDatetime} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
myRouter.use(auth(true));

myRouter.get(`/`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`user/my`, {posts, formatDate, formatDatetime});
});
myRouter.get(`/comments`, async (req, res) => {
  const posts = await api.getPosts({comments: true});
  res.render(`user/comments`, {posts: posts.slice(0, 3), formatDate, formatDatetime});
});

module.exports = myRouter;
