
const mongoose = require('mongoose');

const ProductModel = require('./product.model');

const UserModel = require('./user.model');



const orderSchema = mongoose.Schema({


    UserID :{
        
        type:mongoose.Schema.Types.ObjectId,
        
        ref:UserModel
    },

    Products:[
        
        {
            product:{
                
                type:mongoose.Schema.Types.ObjectId,
                
                ref:ProductModel
            
            },
            Date:{type:String, required:true},

            Quantity:{type:Number},
            
            Address: {type:String , required:true},

            Status:{type:String , required:true , enum:["Confirmed","Cancelled","Delivered"]},


            
            TotalPrice: {type:Number},
        
            PaymentMode: {type:String , required:true , enum:["Cash-On-Delivery","EMI","Internet-Banking"]},

            razorpay_payment_id:{type:String},
            razorpay_order_id:{type:String},
            razorpay_signature:{type:String}


        } 
    
    ],


},

    {
        versionKey:false,
        timestamps :true
    
    }
)


const OrderModel = mongoose.model("orderCollection",orderSchema)

module.exports = OrderModel;
