const Razorpay= require('razorpay');
const Orders= require('../models/orders');

exports.purchasePremium= async (req,res,next) => {
    try
    {
        var rzp= new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount= 3000;
        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err)
            {
                throw new Error(err);
            }
            req.user.createOrder({orderId: order.id, status: 'PENDING'})
            .then(() => {
                return res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch(err => {
                throw new Error(err);
            });
        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({error: err, message: 'Something went wrong!!!'});
    }
}

exports.transactionStatus= (req,res,next) => {
    try
    {
        const payment_id= req.body.payment_id;
        const order_id= req.body.order_id;
        Orders.findOne({where: {orderId: order_id}})
        .then(order => {
            order.update({paymentId: payment_id, status: 'Successful'})
            .then(() => {
                req.user.update({isPremium: true});
                return res.status(201).json({success: true, message: 'Transaction Successful! You are a premium member now!'});
            })
            .catch(err => {
                throw new Error(err);
            });
        })
        .catch(err => {
            throw new Error(err);
        });
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({error: err, message: 'Something went wrong!'});
    }
}