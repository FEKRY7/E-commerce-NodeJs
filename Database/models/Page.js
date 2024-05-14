const mongoose = require('mongoose')

const {Types} = mongoose

const FoxPageSchema = new mongoose.Schema({
title:{
    type:String,
    required:true,
    trim:true
},
description: {
    type: String, 
    required: true, 
    trim: true
},
banners:[
    {
       img:{type:String},
       navigateTo:{type:String} 
    }
],
products:[
    {
       img:{type:String},
       navigateTo:{type:String} 
    }
],
category: {
    type: Types.ObjectId,
    ref: "Category", 
    required: true,
    unique:true
},
createdBy: {
    type: Types.ObjectId,
    ref: "User", 
    required: true
}
}, { timestamps: true })

const Page = mongoose.model('Page',FoxPageSchema)

module.exports = Page