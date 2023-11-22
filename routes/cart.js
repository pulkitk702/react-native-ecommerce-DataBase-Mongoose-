const router = require('express').Router();
const cartController = require('../controllers/cartController');
router.get("/find/:id", cartController.getCart);
router.post("/", cartController.addToCart);
router.post("/quantity", cartController.decrementCart);
router.delete("/:cartItemId", cartController.delteCartItem);


module.exports = router