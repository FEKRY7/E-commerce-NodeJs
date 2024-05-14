const mongoose = require('mongoose')

const {Types} = mongoose

const FoxCartSchema = new mongoose.Schema({
  user:{
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
  }
  ,
  cartItems:[
    {
      productId:{type:Types.ObjectId , ref:'Product'},
      quantity:{type:Number,default:1}
    }    
  ]
}, { timestamps: true })

const Cart = mongoose.model('Cart',FoxCartSchema)

module.exports = Cart