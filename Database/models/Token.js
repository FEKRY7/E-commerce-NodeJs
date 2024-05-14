const mongoose = require('mongoose')

const FoxToken = new mongoose.Schema({
userId:{type:String ,ref:"User" , required:false},
token:{type:String , required:false}
}, { timestamps: true })

const Token = mongoose.model('Token',FoxToken)

module.exports = Token