const express = require("express");
const placesController = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesController.getPlaceById);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.post("/", placesController.createPlace);

module.exports = router;
