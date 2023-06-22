
const mongoose = require('mongoose');
const UserModel = require('./user.model');
const OrderModel = require('./order.model');
const ProductModel = require('./product.model');

const reviewSchema = mongoose.Schema({


    CustomerId: {
        type:mongoose.Schema.Types.ObjectId,
                
        ref: UserModel,
        required : true
    },
    ProductId : {
        type:mongoose.Schema.Types.ObjectId,
                
        ref: ProductModel,
        required : true
    },
    OrderId : {
        type:mongoose.Schema.Types.ObjectId,
                
        ref: OrderModel,
        required : true
    },
    NewRating : {
        type: Number,
        enum : [1,2,3,4,5],
        required : true
    },
    Description : {
        type : String,
        required : true
    }


},

    {
        versionKey:false,
        timestamps :true
    
    }
)


const ReviewModel = mongoose.model("review",reviewSchema)

module.exports = ReviewModel;
