const express = require("express");
const { register, login, logout,checkAuth } = require("../controllers/auth.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/checkAuth', authMiddleware, checkAuth);

module.exports = { authRouter : router };