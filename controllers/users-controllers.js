const HttpError = require('../modules/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_USERS = [
  {
    id: 'u2',
    name: 'Emp State Build',
    email: 'a@a.com',
    password: 'test',
  },
  {
    id: 'u2',
    name: 'Emp State Build',
    email: 'b@b.com',
    password: 'test',
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json(DUMMY_USERS);
};

const signup = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError('Invalid inputs, please try again.');
  }

  const { name, email, password } = req.body;

  const userExists = DUMMY_USERS.find((u) => u.email === email);
  if (userExists) {
    throw new HttpError(`Email ${email} already registred`, 422);
  }
  DUMMY_USERS.push({
    id: uuidv4(),
    name,
    email,
    password,
  });
  res
    .status(200)
    .json({ message: `User for ${name} with email ${email} was created.` });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    throw new HttpError(
      'Could not identify user - please double check email or password',
      401
    );
  }
  res.status(200).json({ message: `Logged in` });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
