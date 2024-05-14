const express = require('express');
const router = express.Router();
const PageControl = require('./../Controler/PageControl.js');
const auth = require('./../Maddewares/Authenticate.js');
const cpUpload = require('./../Maddewares/Multer.js')

router.get('/:category/:type', auth, PageControl.getPage);
router.post('/add', cpUpload, auth, PageControl.CreatePage);
router.patch('/update/:id',auth,cpUpload,PageControl.upDatePage)
router.delete('/delete/:id',auth,PageControl.DeletePage)
 
module.exports = router;