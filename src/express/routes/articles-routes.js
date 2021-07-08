'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {categories});
});
articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body} = req;
  const postData = {
    title: body.title,
    createdDate: `${body.date} 00:00:00`,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: body.category,
  };

  try {
    await api.createPost(postData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});
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
