const express = require('express');
const router = express.Router();
const AddressControl = require('./../Controler/AddressControl.js');
const auth = require('./../Maddewares/Authenticate.js');

router.get('/', auth, AddressControl.getAddress);
router.post('/add', auth, AddressControl.addAddress);
router.patch('/update/:id',auth,AddressControl.upDateAddress)
router.delete('/delete/:id',auth,AddressControl.DeleteAddress)
 
module.exports = router;