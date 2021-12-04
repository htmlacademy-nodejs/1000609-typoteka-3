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

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getPosts({categoryId, categories, comments, limit, offset} = {}) {
    return this._load(`/articles`, {params: {categoryId, categories, comments, limit, offset}});
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

  getLastComments() {
    return this._load(`/comments`);
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
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
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
