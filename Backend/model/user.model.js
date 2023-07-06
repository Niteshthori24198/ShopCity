
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({


    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Gender: { type: String, required: true, enum: ["Male", "Female", "Other"], default: "Other" },
    Location: { type: String, required: true },
    Contact: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isMailVerified: { type: Boolean, default: false },

    Image: { type: String, default: 'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png' },
    S3_Url: { type: String },
    S3_Url_ExipreDate: { type: Date },
    isBlocked: { type: Boolean, default: false },

},

    {
        versionKey: false,
        timestamps: true

    }
)


const UserModel = mongoose.model("user", userSchema)

module.exports = UserModel;
