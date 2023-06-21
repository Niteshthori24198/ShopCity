// RazorPay

const Razorpay = require('razorpay');

const {Router} = require('express')

const checkoutRouter = Router();

var instance = new Razorpay({
    key_id: 'rzp_test_FePSDKRvTiVZWa',
    key_secret: '4JattZlaaFS7KVoIla0gXId1',
});





checkoutRouter.post('/create/orderId', (req, res) => {
    console.log('create order id', req.body);

    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
    };
    instance.orders.create(options, function (err, order) {
        console.log(order);
        res.send({
            orderId: order.id
        })
    });

})



checkoutRouter.post("/api/payment/verify", (req, res) => {
    console.log(req.body);

    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', '4JattZlaaFS7KVoIla0gXId1')
        .update(body.toString())
        .digest('hex');

    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);

    var response = { "signatureIsValid": false }

    if (expectedSignature === req.body.response.razorpay_signature){

        response = { "signatureIsValid": true }

        

        console.log('successfull order placed');

        

    }else{

        console.log('successfull order not placed');
        
    }

    res.send(response);
});

// RazorPay

module.exports = {
    checkoutRouter
}