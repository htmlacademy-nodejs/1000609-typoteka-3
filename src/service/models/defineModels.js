'use strict';

const {Model} = require(`sequelize`);
const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const definePost = require(`./post`);

class PostCategory extends Model {}

const defineModels = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Post = definePost(sequelize);

  Post.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `postId`});
  Comment.belongsTo(Post, {foreignKey: `postId`});

  PostCategory.init({}, {sequelize});

  Post.belongsToMany(Category, {through: PostCategory, as: Alias.CATEGORIES});
  Post.hasMany(PostCategory, {as: Alias.POST_CATEGORIES});
  Category.belongsToMany(Post, {through: PostCategory, as: Alias.POSTS});
  Category.hasMany(PostCategory, {as: Alias.POST_CATEGORIES});

  return {Category, Comment, Post, PostCategory};
};

module.exports = defineModels;
