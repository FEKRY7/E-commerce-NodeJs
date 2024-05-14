const mongoose = require('mongoose')

const {Types} = mongoose

const OrderSchema = new mongoose.Schema({
  user:{
        type: Types.ObjectId,
        ref: "User",
        required: true
  },
  addressId:{
        type: Types.ObjectId,
        ref: "UserAddress.address",
        required: true
  }, 
  totol:{
    type:Number,
    required: true
  },
  items:[
    {
        productId:{ 
            type:Types.ObjectId ,
            ref:'Product'
        },
        name:{
          type:String,
          required: true
      },
        payablePrice:{
            type:Number,
            required: true
        },
        purchasedQty:{
            type:Number,
            required: true
        }
    }
  ],
  paymentStatus:{
    type: String, 
    enum:['pending','completed','cancelled','refund'],
    required: true
  },
  payment:{
    type: String, 
    enum:["cash","visa"],
    required: true
  },   
  orderStatus:[
    {
      type:{
        type: String, 
        enum:["placed","shipped","deliverd","canceled","refunded","Paid by visa","faild to pay"],
        default: 'ordered'
      },
      date:{
        type:Date
      },
      isCompleted:{
        type:Boolean,
        default: false
      }
    }
  ]
}, { timestamps: true })

const Order = mongoose.model('Order',OrderSchema)

module.exports = Order