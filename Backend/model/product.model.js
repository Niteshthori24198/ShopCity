
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    Image:{type:String, required:true},
    Title:{type:String, required:true},
    Category:{type:String, required:true},
    Description:{type:String, required:true},
    Price:{type:Number, required:true},
    Quantity:{type:Number, required:true},

    Rating:{type:Number, required:true, default:0},
    Total_Review_Count : {type : Number, default:0},
    Total_Review_Sum : {type : Number, default:0}




},
    {
        versionKey:false,
        timestamps :true
    
    }
)


const ProductModel = mongoose.model("product",productSchema)

module.exports = ProductModel;
