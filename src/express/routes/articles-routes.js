'use strict';

const {Router} = require(`express`);
const session = require(`express-session`);
const {nanoid} = require(`nanoid`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);

const articlesRouter = new Router();

articlesRouter.use(session({
  resave: false,
  saveUninitialized: false,
  secret: nanoid()
}));

articlesRouter.get(`/add`, async (req, res) => {
  const {post} = req.session;
  delete req.session.post;
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {categories, post});
});
articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const postData = {
    title: body.title,
    createdAt: `${body.date}T00:00:00.000Z`,
    picture: file && file.filename ? file.filename : null,
    announcement: body.announcement,
    fullText: body[`full-text`] ? body[`full-text`] : null,
    categories: body.category,
  };

  try {
    await api.createPost(postData);
    res.redirect(`/my`);
  } catch (e) {
    req.session.post = body;
    res.redirect(`back`);
  }
});
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [post, categories] = await Promise.all([
    api.getPost(id),
    api.getCategories(true)
  ]);
  res.render(`articles/post`, {post, categories, formatDate, formatDatetime});
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [post, categories] = await Promise.all([
    api.getPost(id),
    api.getCategories(true)
  ]);
  res.render(`articles/post`, {post, categories, formatDate, formatDatetime});
});

module.exports = articlesRouter;
