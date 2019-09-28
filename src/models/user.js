const knex = require("knex")(
  require("../../knexfile")[process.env.NODE_ENV || "development"]
);
const ValidationError = require("../errors/validationError");

class User {
  constructor(data) {
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.password = data.password;
  }

  async save() {
    if (!this.name || !this.surname) {
      throw new ValidationError("Missing name or surname");
    }
    const res = await knex
      .insert({
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password
      })
      .into("users");
    return res[0];
  }

  static async getById(id) {
    if (isNaN(id) || id < 0) {
      throw new ValidationError("Invalid user ID");
    }
    const user = await knex("users")
      .select()
      .where("id", id)
      .first();
    return user;
  }

  static async findByEmail(email) {
    const user = await knex("users")
      .select()
      .where("email", email)
      .first();
    return user;
  }
}

module.exports = User;
