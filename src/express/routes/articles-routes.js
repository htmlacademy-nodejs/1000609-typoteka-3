'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`articles/new-post`));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [post, categories] = await Promise.all([
    api.getPost(id),
    api.getCategories()
  ]);
  res.render(`articles/post`, {post, categories, formatDate, formatDatetime});
});

module.exports = articlesRouter;
