'use strict';

const {Model} = require(`sequelize`);
const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const definePost = require(`./post`);
const defineUser = require(`./user`);

class PostCategory extends Model {}

const defineModels = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Post = definePost(sequelize);
  const User = defineUser(sequelize);

  Post.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `postId`, onDelete: `cascade`});
  Comment.belongsTo(Post, {foreignKey: `postId`});

  PostCategory.init({}, {sequelize});

  Post.belongsToMany(Category, {through: PostCategory, as: Alias.CATEGORIES});
  Post.hasMany(PostCategory, {as: Alias.POST_CATEGORIES});
  Category.belongsToMany(Post, {through: PostCategory, as: Alias.POSTS});
  Category.hasMany(PostCategory, {as: Alias.POST_CATEGORIES});

  User.hasMany(Post, {as: Alias.POSTS, foreignKey: `userId`});
  Post.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  return {Category, Comment, Post, PostCategory, User};
};

module.exports = defineModels;
