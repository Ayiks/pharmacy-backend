const User = require("../models/user");
const bcrypt = require("bcrypt");

const UserController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async createUser(req, res) {

    const { name, email, password, telephone, role } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = {
            name,
            email,
            password: hashedPassword,
            telephone,
            role,
          };
      const userId = await User.create(user);
      res.status(201).json({ id: userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async updateUser(req, res) {
    console.log(req.body);
    try {
      const userId = req.params.id;
      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.update(userId, req.body);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.delete(userId);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = UserController;
