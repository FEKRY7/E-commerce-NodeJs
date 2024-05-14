const express = require('express');
const router = express.Router();
const CartControl = require('./../Controler/CartControl.js');
const auth = require('./../Maddewares/Authenticate.js');

router.get('/', auth, CartControl.viewCart);
router.post('/add', auth, CartControl.addToCart);
router.patch('/remove/:id', auth, CartControl.removeFromCart);
router.put('/clear', auth, CartControl.clearCart);
 
module.exports = router;

