const mongoose = require('mongoose');

const {Types} = mongoose

const CategorySchema = new mongoose.Schema({
    name: {
         type: String, 
         required: true, 
         trim:true
    },
    slug: {
        type: String, 
        required: true,
        unique:true 
   },
   type:{
     type: String, 
   },
   categoryImage:{type: String},
   productId: {
    type: String 
   },
   createdBy:{
     type:Types.ObjectId,
     ref:'User'
 }

}, 
{ timestamps: true }); // Move the timestamps option inside the schema definition

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;




