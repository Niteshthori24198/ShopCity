
const mongoose = require('mongoose');
const ReviewModel = require('./review.model');

const replySchema = mongoose.Schema({


    ReviewId: {
        type:mongoose.Schema.Types.ObjectId,
                
        ref: ReviewModel,
        required : true
    },
    Reply : [{
        type : String,
        required : true
    }]


},

    {
        versionKey:false,
        timestamps :true
    
    }
)


const ReplyModel = mongoose.model("reply",replySchema)

module.exports = ReplyModel;
