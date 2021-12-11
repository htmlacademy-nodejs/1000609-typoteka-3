'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    try {
      const user = await this._User.create(userData);
      return user.get();
    } catch (err) {
      return null;
    }
  }

  async findById(id) {
    try {
      const user = await this._User.findOne({
        where: {id}
      });
      return user && user.get();
    } catch (err) {
      return null;
    }
  }

  async findByEmail(email) {
    try {
      const user = await this._User.findOne({
        where: {email}
      });
      return user && user.get();
    } catch (err) {
      return null;
    }
  }
}

module.exports = UserService;
