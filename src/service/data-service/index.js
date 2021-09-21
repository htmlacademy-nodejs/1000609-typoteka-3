'use strict';

const PostService = require(`./post`);
const CommentService = require(`./comment`);
const SearchService = require(`./search`);
const CategoryService = require(`./category`);
const UserService = require(`./user`);

module.exports = {
  PostService,
  CommentService,
  SearchService,
  CategoryService,
  UserService
};
