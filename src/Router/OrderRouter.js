const express = require('express');
const router = express.Router();
const OrderControl = require('./../Controler/OrderControl.js');
const auth = require('./../Maddewares/Authenticate.js');

router.get('/', auth, OrderControl.getOrder);
router.post('/add', auth, OrderControl.addOrder);
router.post('/update', auth, OrderControl.updateOrder);
router.post('/Webhook', express.raw({type: 'application/json'})
, OrderControl.orderWebhook)
module.exports = router;

