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

  getPosts({categories, comments, limit, offset} = {}) {
    return this._load(`/articles`, {params: {categories, comments, limit, offset}});
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
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
