const router = require('express').Router();
const favouritesController = require('../controllers/favouritesController');
router.get("/", favouritesController.getAllFavourites)

router.post("/", favouritesController.createFavourites)
module.exports = router