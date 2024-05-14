const express = require('express')
const router = express.Router()
const CategoryControl = require('./../Controler/CategoryControl.js')
const auth =  require('./../Maddewares/Authenticate.js')
const cpUpload = require('./../Maddewares/Multer.js')

router.get('/',CategoryControl.getCategory)
router.post('/create',auth,cpUpload,CategoryControl.addCategory)
router.patch('/update/:id',auth,cpUpload,CategoryControl.upDateCategory)
router.delete('/delete/:id',auth,CategoryControl.DeleteCategory)
module.exports = router