'use strict';

class CategoryService {
  constructor(posts) {
    this._posts = posts;
  }

  findAll() {
    const categories = this._posts.reduce((acc, post) => {
      post.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
