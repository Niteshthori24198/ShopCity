
const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expirationDate: {
        type: Date,
        required: true
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)

const BlacklistModel = mongoose.model("blacklist", blacklistSchema)

module.exports = BlacklistModel;
