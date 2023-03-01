const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

// Get all users
router.get('/users', UserController.getAllUsers);

// Create a new user
router.post('/users', UserController.createUser);

// Get a user by id
router.get('/users/:id', UserController.getUserById);

// Update a user by id
router.patch('/users/:id', UserController.updateUser);

// Delete a user by id
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;
