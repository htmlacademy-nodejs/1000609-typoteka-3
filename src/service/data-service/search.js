'use strict';

class SearchService {
  constructor(posts) {
    this._posts = posts;
  }

  findAll(searchText) {
    return this._posts.filter((post) => post.title.toLowerCase().includes(searchText.toLowerCase()));
  }
}

module.exports = SearchService;
