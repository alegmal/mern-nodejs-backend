const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const { error } = require('console');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured' });
});

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};
const uri =
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.3fepk.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("starting server...")
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
