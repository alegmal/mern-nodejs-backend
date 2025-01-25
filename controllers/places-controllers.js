const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError(`Something went wrong... ${err}`, 500));
  }

  if (!place) {
    return next(
      new HttpError(
        `Could not find a place for the provided id (${placeId})`,
        404
      )
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    return next(new HttpError(`Something went wrong... ${err}`, 500));
  }

  if (!userWithPlaces || userWithPlaces.places.length == 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: getCoordsForAddress(address),
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/320px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg',
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError('Creating place failed', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id.', 404));
  }

  try {
    const sessionId = await mongoose.startSession();
    sessionId.startTransaction();

    await createdPlace.save({ session: sessionId });

    user.places.push(createdPlace);
    await user.save({ session: sessionId });

    await sessionId.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(`Something went wrong when saving a place... ${err}`, 500)
    );
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError(`Something went wrong... ${err}`, 500));
  }

  if (place.length == 0) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    );
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError(`Something went wrong when updating place... ${err}`, 500)
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (error) {
    return next(new HttpError(`Something went wrong... ${err}`, 500));
  }

  if (!place) {
    throw new HttpError('Could not find a place with provided id.', 404);
  }

  try {
    const sessionId = await mongoose.startSession();
    sessionId.startTransaction();
    await place.deleteOne({ session: sessionId });
    place.creator.places.pull(place);
    await place.creator.save({ session: sessionId });
    await sessionId.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(`Something went wrong when deleting place... ${err}`, 500)
    );
  }

  res.status(200).json({ message: 'Deleted place.', place: place });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
