'use strict';

const {Router} = require(`express`);
const session = require(`express-session`);
const {nanoid} = require(`nanoid`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime, prepareErrors} = require(`../../utils`);

const articlesRouter = new Router();

articlesRouter.use(session({
  resave: false,
  saveUninitialized: false,
  secret: nanoid()
}));

const getPostWithCategories = async (postId, countCategories) => {
  const [post, categories] = await Promise.all([
    api.getPost(postId),
    api.getCategories(countCategories)
  ]);
  return [post, categories];
};

articlesRouter.get(`/add`, async (req, res) => {
  const {post, validationMessages} = req.session;
  delete req.session.post;
  delete req.session.validationMessages;
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {post, categories, validationMessages});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const postData = {
    title: body.title,
    createdAt: `${body.date}T00:00:00.000Z`,
    picture: file && file.filename ? file.filename : (body.photo || null),
    announcement: body.announcement,
    fullText: body[`full-text`] ? body[`full-text`] : null,
    categories: body.category,
  };

  try {
    await api.createPost(postData);
    res.redirect(`/my`);
  } catch (err) {
    req.session.post = {...postData, picture: body.photo};
    req.session.validationMessages = prepareErrors(err);
    res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [post, categories] = await getPostWithCategories(id, true);
  res.render(`articles/post`, {post, categories, formatDate, formatDatetime});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  let {post, validationMessages} = req.session;
  let categories;
  delete req.session.post;
  delete req.session.validationMessages;

  if (!post) {
    [post, categories] = await getPostWithCategories(id);
    const postCategories = post.categories.map((category) => category.id.toString());
    post = {...post, categories: postCategories};
  } else {
    categories = await api.getCategories();
  }

  res.render(`articles/new-post`, {id, post, categories, validationMessages});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const postData = {
    title: body.title,
    createdAt: `${body.date}T00:00:00.000Z`,
    picture: file && file.filename ? file.filename : body.photo,
    announcement: body.announcement,
    fullText: body[`full-text`] ? body[`full-text`] : null,
    categories: body.category,
  };

  try {
    await api.editPost(id, postData);
    res.redirect(`/my`);
  } catch (err) {
    req.session.post = {...postData, picture: body.photo};
    req.session.validationMessages = prepareErrors(err);
    res.redirect(`back`);
  }
});

module.exports = articlesRouter;
