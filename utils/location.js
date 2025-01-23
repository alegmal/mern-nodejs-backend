const axios = require('axios');
const HttpError = require('../models/http-error');

function getCoordsForAddress(address) {
  return {
    lat: 40.7484474,
    long: -73.9871516,
  };

  //   const response = await axios.get(`URL + ${address}`);
  //   const data = response.data;

  //   if (!data || data.status === 'ZERO_RESULTS') {
  //     throw new HttpError('No bueno finding coordinates for address', 404);
  //   }

  //   const coordinates = data.results[0].geometry.location;
  //   return coordinates;
}

module.exports = getCoordsForAddress;
