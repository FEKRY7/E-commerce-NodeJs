const Order = require('../../Database/models/Order.js')
const Cart = require('../../Database/models/Cart.js')
const Address = require('../../Database/models/Addres.js');
const Stripe  = require('stripe')
const http = require('../folderS,F,E/S,F,E.JS'); // Fixed typo in the require path
const Responsers = require("../utilites/httperespons.js");// Fixed typo and added object destructuring for imported functions

const addOrder = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
             return Responsers.Firest(res, ["User ID not found in request"], 400, http.FAIL);
        }

        req.body.user = req.user._id;
        req.body.orderStatus = [
            { type: 'placed', date: new Date(), isCompleted: true },
            { type: 'shipped', isCompleted: false },
            { type: 'deliverd', isCompleted: false },
            { type: 'canceled', isCompleted: false },
            { type: 'refunded', isCompleted: false },
            { type: 'Paid by visa', isCompleted: false },
            { type: 'faild to pay', isCompleted: false }
        ];

        const deleteResult = await Cart.deleteOne({ user: req.user._id });
        if (deleteResult.deletedCount === 0) {
            console.log('No cart found for user:', req.user._id);
            // Handle this case according to your application logic
        }

        const order = await Order.create(req.body);
   
        if (req.body.payment === "visa") { // Changed from req.body.payment to req.body.paymentType
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

            const session = await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                metadata:{order_id:order._id.toString()},
                mode:"payment",
                success_url:"http://localhost:3000/successPage.html",
                cancel_url:"http://localhost:3000/cancelPage.html",
                line_items:order.items.map((item) => ({
                    price_data: {
                        currency: "egp",
                        product_data: { name: item.name },
                        unit_amount: item.payablePrice * 100
                    },
                    quantity: item.purchasedQty
                })),
            });
            return Responsers.Schand(res, [{checkout_url: session.url, order}], 200, http.SUCCESS);
        }

        return Responsers.Schand(res, [order], 200, http.SUCCESS);
    } catch (error) {
        console.error('Error adding order:', error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};


const getOrder = async (req, res) => {
    try {
        // Retrieve the order associated with the authenticated user
        const order = await Order.findOne({ user: req.user._id })
            .populate({
                path: 'items.productId',
                select: '_id name productPictures' // Select fields to populate
            })
            .lean();

        // If no order is found, return a 404 response
        if (!order) {

           return Responsers.Firest(res, ["Order not found"], 400, http.FAIL);
        }

        // Retrieve the user's address
        const address = await Address.findOne({ user: req.user._id });

        // If address found, populate the order with the address details
        if (address) {
            order.address = address;
        }

        // Send the order details as response
        return Responsers.Schand(res, [order], 200, http.SUCCESS);

    } catch (error) {
        console.error('Error fetching order:', error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const updateOrder = async (req, res) => {
    try {
        const updateResult = await Order.updateOne(
            { _id: req.body.orderId, 'orderStatus.type': req.body.type },
            {
                $set: {
                    'orderStatus.$.date': new Date(),
                    'orderStatus.$.isCompleted': true
                }
            }
        );

        return Responsers.Schand(res, [updateResult], 200, http.SUCCESS);
    } catch (error) {
        console.error('Error updating order:', error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};


const orderWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err);
        return Responsers.Firest(res, [`Webhook Error: ${err.message}`], 400, http.FAIL);
    }

    const orderId = event.data.object.metadata.order_id;

    if (event.type === 'checkout.session.completed') {
        
    await Order.findOneAndUpdate({ _id: orderId }, { paymentStatus:{type: 'Paid by visa', date: new Date(), isCompleted: true} });
    return

    }

    await Order.findOneAndUpdate({ _id: orderId }, { paymentStatus:{type: 'faild to pay', date: new Date(), isCompleted: true} });
    return 

}


module.exports = {
    addOrder,
    getOrder,
    updateOrder,
    orderWebhook
}
