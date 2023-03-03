const db = require("../config/db");

const User = {
  async getAll() {
    const [rows] = await db.execute("SELECT * FROM users");
    return rows;
  },

  async getById(userId) {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    return rows[0];
  },

  async create(user) {
    const { name, email, password, telephone, role } = user;
    const sql = 'INSERT INTO users (name, email, password, telephone, permissions) VALUES (?, ?, ?, ?, ?)';
    const values = [name, email, password, telephone, permissions];
    const [result] = await db.execute(sql, values.map(val => (val !== undefined ? val : "")));
    return result.insertId;
  },  

  async update(userId, user) {
    let query = "UPDATE users SET ";
    let params = [];
    let keys = Object.keys(user);
    keys.forEach((key, index) => {
      if (user[key] !== null && key !== 'id') {
        query += key + " = ?";
        params.push(user[key]);
        if (index < keys.length - 1) {
          query += ", ";
        }
      }
    });
    query += " WHERE id = ?";
    params.push(userId);
  
    await db.execute(query, params);
  },  

  async delete(userId) {
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);
  },
};

module.exports = User;
