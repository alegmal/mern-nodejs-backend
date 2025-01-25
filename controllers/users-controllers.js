const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const user = require('../models/user');

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

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(
      new HttpError(
        `Something went wrong when getting all users... ${err}`,
        500
      )
    );
  }

  if (!users) {
    return next(new HttpError(`Found no users...`, 404));
  }

  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs, please try again.'));
  }

  const { name, email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError(
        `Something went wrong when checking if user already exists... ${err}`,
        500
      )
    );
  }

  if (userExists) {
    return next(new HttpError(`Email ${email} already registred`, 422));
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/320px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg',
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError(`Something went wrong when signing up... ${err}`, 500)
    );
  }

  res.status(200).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError(
        `Something went wrong when when trying to log in... ${err}`,
        500
      )
    );
  }
  console.log(foundUser);
  if (!foundUser || foundUser.password !== password) {
    return next(
      new HttpError(
        'Could not identify user - please double check email or password',
        401
      )
    );
  }

  res.status(200).json({ message: `Logged in` });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
