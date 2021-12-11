'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const {formatDate, formatDatetime} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
myRouter.use(auth(true));

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  try {
    const posts = await api.getPosts();
    res.render(`user/my`, {posts, user, formatDate, formatDatetime});
  } catch (err) {
    res.render(`errors/500`);
  }
});

myRouter.post(`/:articleId`, async (req, res) => {
  const {articleId} = req.params;

  try {
    await api.dropPost(articleId);
    res.redirect(`back`);
  } catch (err) {
    res.render(`errors/500`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;

  try {
    const comments = await api.getComments();
    res.render(`user/comments`, {comments, user, formatDate, formatDatetime});
  } catch (err) {
    res.render(`errors/500`);
  }
});

myRouter.post(`/comments/:commentId/article/:articleId`, async (req, res) => {
  const {articleId, commentId} = req.params;

  try {
    await api.dropComment(articleId, commentId);
    res.redirect(`back`);
  } catch (err) {
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
