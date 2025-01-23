const HttpError = require('../modules/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Emp State Build',
    description: 'big boo boo',
    location: {
      lat: 40.7484474,
      long: -73.9871516,
    },
    address: 'over there',
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Emp State Build #2',
    description: 'big boo boo baba',
    location: {
      lat: 40.7484474,
      long: -73.9871516,
    },
    address: 'over there',
    creator: 'u1',
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError(
      `Could not find a place for the provided id (${placeId})`,
      404
    );
  }

  res.json(place);
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (places.length == 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json(places);
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const error = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;
  const place = { ...DUMMY_PLACES.find((place) => place.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => place.id === placeId);

  if (place.length == 0) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    );
  }

  place.title = title;
  place.description = description;

  DUMMY_PLACES[placeIndex] = place;

  res.status(200).json(place);
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError('Could not find a place with provided id.', 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
  res.status(200).json({ message: 'Deleted place.', place: place });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
