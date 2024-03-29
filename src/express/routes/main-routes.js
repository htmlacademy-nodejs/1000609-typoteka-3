'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);
const {POSTS_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();
const csrfProtection = csrf();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;
  const limit = POSTS_PER_PAGE;
  const offset = (page - 1) * POSTS_PER_PAGE;

  try {
    const [popularPosts, {count, posts}, categories, lastComments] = await Promise.all([
      api.getPopularPosts(),
      api.getPosts({limit, offset}),
      api.getCategories(true, true),
      api.getLastComments()
    ]);

    if (posts.length) {
      const totalPages = Math.ceil(count / POSTS_PER_PAGE);
      res.render(`main`, {popularPosts, posts, categories, user, lastComments, page, totalPages, formatDate, formatDatetime});
    } else {
      res.render(`main-empty`, {user});
    }
  } catch (err) {
    res.render(`errors/500`);
  }
});

mainRouter.get(`/register`, csrfProtection, (req, res) => {
  const {user, userData, validationMessages} = req.session;
  delete req.session.userData;
  delete req.session.validationMessages;

  if (user) {
    res.redirect(`/`);
  } else {
    res.render(`sign-up`, {userData, validationMessages, csrfToken: req.csrfToken()});
  }
});

mainRouter.post(`/register`, upload.single(`upload`), csrfProtection, async (req, res) => {
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

mainRouter.get(`/login`, csrfProtection, (req, res) => {
  const {user, userEmail, validationMessages} = req.session;
  delete req.session.userEmail;
  delete req.session.validationMessages;

  if (user) {
    res.redirect(`/`);
  } else {
    res.render(`login`, {userEmail, validationMessages, csrfToken: req.csrfToken()});
  }
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
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

mainRouter.get(`/categories`, auth(true), csrfProtection, async (req, res) => {
  const {category, editingId, editingName, user, validationMessages} = req.session;
  delete req.session.category;
  delete req.session.editingId;
  delete req.session.editingName;
  delete req.session.validationMessages;

  const isValidationForNew = !!category;

  try {
    const categories = await api.getCategories(true);

    res.render(`all-categories`, {category, categories, editingId, editingName, isValidationForNew, validationMessages, user, csrfToken: req.csrfToken()});
  } catch (err) {
    res.render(`errors/500`);
  }
});

mainRouter.post(`/categories`, auth(true), csrfProtection, async (req, res) => {
  const {category} = req.body;

  try {
    await api.createCategory({name: category});
    res.redirect(`back`);
  } catch (err) {
    req.session.category = category;
    req.session.validationMessages = prepareErrors(err);
    res.redirect(`back`);
  }
});

mainRouter.post(`/categories/edit/:id`, auth(true), csrfProtection, async (req, res) => {
  const {body} = req;
  const {id} = req.params;

  const newCategory = {
    name: body[`category-${id}`]
  };

  try {
    await api.editCategory(id, newCategory);
    res.redirect(`/categories`);
  } catch (err) {
    req.session.editingId = id;
    req.session.editingName = newCategory.name;
    req.session.validationMessages = prepareErrors(err);
    res.redirect(`back`);
  }
});

mainRouter.post(`/categories/delete/:id`, auth(true), csrfProtection, async (req, res) => {
  const {id} = req.params;

  try {
    await api.dropCategory(id);
    res.redirect(`back`);
  } catch (err) {
    res.render(`errors/500`);
  }
});

module.exports = mainRouter;
