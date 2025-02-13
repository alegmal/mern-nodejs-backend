const express = require('express');
const usersController = require('../controllers/users-controllers');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 5 }),
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
