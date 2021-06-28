'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const postValidator = require(`../middlewares/post-validator`);
const postExist = require(`../middlewares/post-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, postService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const posts = postService.findAll();
    res.status(HttpCode.OK).json(posts);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId: postId} = req.params;
    const post = postService.findOne(postId);

    if (!post) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${postId}`);
    }

    return res.status(HttpCode.OK)
      .json(post);
  });

  route.post(`/`, postValidator, (req, res) => {
    const post = postService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(post);
  });

  route.put(`/:articleId`, postValidator, (req, res) => {
    const {articleId: postId} = req.params;
    const existPost = postService.findOne(postId);

    if (!existPost) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${postId}`);
    }

    const updatedPost = postService.update(postId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedPost);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId: postId} = req.params;
    const post = postService.drop(postId);

    if (!post) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(post);
  });

  route.get(`/:articleId/comments`, postExist(postService), (req, res) => {
    const {post} = res.locals;
    const comments = commentService.findAll(post);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, postExist(postService), (req, res) => {
    const {post} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(post, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [postExist(postService), commentValidator], (req, res) => {
    const {post} = res.locals;
    const comment = commentService.create(post, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
