const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const loginController = require('../controllers/loginController');

router.post('/login',  loginController.login);

module.exports = router;
