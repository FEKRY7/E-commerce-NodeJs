const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

const productSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    slug: {
        type: String, 
        required: true,
        unique: true 
    },
    price: { 
        type: Number, 
        required: true 
    }, 
    quantity:{ 
        type:Number , 
        required: true
    },
    description: {
        type: String, 
        required: true, 
        trim: true
    },
    offer: { type: Number },
    gallery: [
        { img: { type: String } }
    ],
    reviews: [
        {
            userId: { type: Types.ObjectId, ref: "User" },
            review: String
        }
    ],
    category: {
        type: Types.ObjectId,
        ref: "Category", 
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User", 
        required: true
    },
    updatedAt: Date
}, { timestamps: true });

productSchema.query.paginate = function (page) {
    page = page <1 || isNaN(page) || !page ? 1:page
    const limit = 2
    const skip = limit * (page-1)
    return this.skip(skip).limit(limit)
}

productSchema.query.search= function(keyword){
    if(keyword){
        return this.find({name:{$regex :keyword , $options:"i"}})
    }
    return this

}

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

