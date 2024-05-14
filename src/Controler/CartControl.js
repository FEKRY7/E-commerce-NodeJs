const Cart = require('../../Database/models/Cart.js')
const Product = require('../../Database/models/Product.js')
const http = require("../folderS,F,E/S,F,E.JS");
const Responsers = require("../utilites/httperespons.js");


const viewCart = async (req, res) => {
    try {
        // Retrieve the cart for the user
        if(req.user.role == "user"){
            const userId = req.user._id; // Assuming you have user authentication and the user ID is available
            const cart = await Cart.findOne({ user: userId });
            return Responsers.Schand(res, [cart], 200, http.SUCCESS)  
        }

        if(req.user.role == "admin" && !req.body.cartId){
            return Responsers.Firest(res, ["Cart id is required"], 400, http.FAIL);
        } else {
            const cart = await Cart.findById(req.body.cartId);
            return Responsers.Schand(res, [cart], 200, http.SUCCESS)
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const addToCart = async (req, res) => {
    try {
        const productId = req.body.cartItems.productId;
        // Find the product by _id
        
        const product = await Product.findOne({ _id: productId });
        if (!product) 
        return Responsers.Firest(res, ["Product not found"], 400, http.FAIL);

        // Find the user's cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            // Check if the product already exists in the cart
            const item = cart.cartItems.find(c => c.productId == productId);
            if (item) {
                // If the product exists, update its quantity
                const updates = await Cart.findOneAndUpdate(
                    { "user": req.user._id, "cartItems.productId": productId },
                    { $set: { "cartItems.$.quantity": item.quantity + req.body.cartItems.quantity } },
                    { new: true }
                );
                return Responsers.Schand(res, [updates], 200, http.SUCCESS);
            } else {
                // If the product does not exist, add it to the cart
                const updates = await Cart.findOneAndUpdate(
                    { user: req.user._id },
                    { $push: { cartItems: req.body.cartItems } },
                    { new: true }
                );
                return Responsers.Schand(res, [updates], 200, http.SUCCESS);
            }
        } else {
            // If cart doesn't exist, create a new one
            const newCart = await Cart.create({
                user: req.user._id,
                cartItems: [req.body.cartItems]
            });
            return res.json(newCart);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);;
       return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const removeFromCart = async (req, res) => {
    try {
        const findId = req.params.id;
        const product = await Product.findById(findId);

        if (!product) {
            return Responsers.Firest(res, ["Cart Not Found"], 400, http.FAIL);
        }

        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { cartItems: { productId: req.params.id } } }
        );

        return Responsers.Schand(res, ['Done'], 200, http.SUCCESS);
    } catch (error) {
        console.log(error);
         return  Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);;
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { cartItems: [] } },
            { new: true } // to return the updated document
        );

        return Responsers.Schand(res, [cart], 200, http.SUCCESS);
    } catch (error) {
        console.log(error);
      return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);;
    }
};

  
module.exports={
    addToCart,
    viewCart,
    removeFromCart,
    clearCart
}