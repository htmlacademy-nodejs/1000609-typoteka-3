'use strict';

const express = require(`express`);
const path = require(`path`);
const {HttpCode} = require(`../constants`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/400`));
app.use((err, req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.listen(DEFAULT_PORT);
