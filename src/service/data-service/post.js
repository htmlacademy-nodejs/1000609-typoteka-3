'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class PostService {
  constructor(posts) {
    this._posts = posts;
  }

  create(post) {
    const newPost = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, post);

    this._posts.push(newPost);
    return newPost;
  }

  findAll() {
    return this._posts;
  }

  findOne(id) {
    return this._posts.find((item) => item.id === id);
  }

  update(id, post) {
    const oldPost = this._posts.find((item) => item.id === id);

    return Object.assign(oldPost, post);
  }

  drop(id) {
    const post = this._posts.find((item) => item.id === id);

    if (!post) {
      return null;
    }

    this._posts = this._posts.filter((item) => item.id !== id);
    return post;
  }
}

module.exports = PostService;
