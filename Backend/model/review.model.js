
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
        required : true
    },
    Description : {
        type : String,
        required : true
    },
    CustomerName : { type:String },
    Image : { type:String },
    Video : { type : String },
    S3_Url:{ type:String },
    S3_Url_ExipreDate:{ type:Date },
    CustomerImage : {type:String, default : 'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png'}


},

    {
        versionKey:false,
        timestamps :true
    
    }
)


const ReviewModel = mongoose.model("review",reviewSchema)

module.exports = ReviewModel;
