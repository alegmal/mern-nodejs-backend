const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Emp State Build",
    description: "big boo boo",
    location: {
      lat: 40.7484474,
      long: -73.9871516,
    },
    address: "over there",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp State Build #2",
    description: "big boo boo baba",
    location: {
      lat: 40.7484474,
      long: -73.9871516,
    },
    address: "over there",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  console.log("GET Request places by ID");
  const placeId = req.params.pid;
  res.json(
    DUMMY_PLACES.find((place) => {
      return place["id"] === placeId;
    })
  );
});

router.get("/user/:uid", (req, res, next) => {
  console.log("GET Request places by user ID");
  const userId = req.params.uid;
  res.json(
    DUMMY_PLACES.map((place) => {
       if(place["creator"] === userId){
        return place
       }
    })
  );
});

module.exports = router;
