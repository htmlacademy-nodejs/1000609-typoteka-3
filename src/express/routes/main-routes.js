'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);
const {POSTS_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;
  const limit = POSTS_PER_PAGE;
  const offset = (page - 1) * POSTS_PER_PAGE;

  const [{count, posts}, categories] = await Promise.all([
    api.getPosts({categories: true, comments: true, limit, offset}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  res.render(`main`, {posts, categories, user, page, totalPages, formatDate, formatDatetime});
});

mainRouter.get(`/register`, (req, res) => {
  const {userData, validationMessages} = req.session;
  delete req.session.userData;
  delete req.session.validationMessages;

  res.render(`sign-up`, {user: userData, validationMessages});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    email: body.email,
    name: body.name,
    surname: body.surname,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file && file.filename ? file.filename : (body.upload || null)
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    req.session.userData = userData;
    req.session.validationMessages = prepareErrors(err);
    res.redirect(`back`);
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {userEmail, validationMessages} = req.session;
  delete req.session.userEmail;
  delete req.session.validationMessages;

  res.render(`login`, {userEmail, validationMessages});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth({email, password});
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (err) {
    req.session.userEmail = email;
    req.session.validationMessages = prepareErrors(err);
    res.redirect(`back`);
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  const {user} = req.session;

  if (search) {
    try {
      const results = await api.search(search);

      res.render(`search`, {results, search, user, formatDate, formatDatetime});
    } catch (error) {
      res.render(`search`, {results: [], search, user});
    }
  } else {
    res.render(`search`, {user});
  }
});

mainRouter.get(`/categories`, auth(true), (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
