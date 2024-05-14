const express = require('express')
const router = express.Router()
const ProductControl = require('./../Controler/ProdectControl.js')
const cpUpload = require('./../Maddewares/Multer.js')
const auth =  require('./../Maddewares/Authenticate.js')

router.route('/api/product')
.get(ProductControl.getProduct)
.post(auth,cpUpload,ProductControl.addProduct)
 
router.route('/api/product/:id')
.get(ProductControl.getProductById)
.patch(ProductControl.upDateProduct)
.delete(ProductControl.DeleteProduct)
 
module.exports = router