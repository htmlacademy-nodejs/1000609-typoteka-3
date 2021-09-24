'use strict';

const {Router} = require(`express`);
const session = require(`express-session`);
const {nanoid} = require(`nanoid`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);
const {POSTS_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

mainRouter.use(session({
  resave: false,
  saveUninitialized: false,
  secret: nanoid()
}));

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = POSTS_PER_PAGE;
  const offset = (page - 1) * POSTS_PER_PAGE;

  const [{count, posts}, categories] = await Promise.all([
    api.getPosts({categories: true, comments: true, limit, offset}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  res.render(`main`, {posts, categories, page, totalPages, formatDate, formatDatetime});
});

mainRouter.get(`/register`, (req, res) => {
  let {userData, validationMessages} = req.session;
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

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;

  if (search) {
    try {
      const results = await api.search(search);

      res.render(`search`, {results, search, formatDate, formatDatetime});
    } catch (error) {
      res.render(`search`, {results: [], search});
    }
  } else {
    res.render(`search`);
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
