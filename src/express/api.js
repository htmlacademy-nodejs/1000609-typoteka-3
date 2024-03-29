'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  getPosts({categoryId, limit, offset} = {}) {
    return this._load(`/articles`, {params: {categoryId, limit, offset}});
  }

  getPopularPosts() {
    return this._load(`/articles`, {params: {needPopular: true}});
  }

  getPost(id) {
    return this._load(`/articles/${id}`);
  }

  createPost(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editPost(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  dropPost(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  getComments() {
    return this._load(`/comments`);
  }

  getLastComments() {
    return this._load(`/comments/last`);
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  dropComment(articleId, commentId) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE
    });
  }

  getCategories(count, withPosts) {
    return this._load(`/categories`, {params: {count, withPosts}});
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  editCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  dropCategory(categoryId) {
    return this._load(`/categories/${categoryId}`, {
      method: HttpMethod.DELETE
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(data) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data
    });
  }

  async _load(url, options) {
    try {
      const response = await this._http.request({url, ...options});
      return response.data;
    } catch (err) {
      return null;
    }
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
