const mongoose = require('mongoose')

const querySchema = mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Category: { type: String, required: true },
    Query: { type: String, required: true }
},

    {

        versionKey: false
    }

)


const QueryModel = mongoose.model("query", querySchema)


module.exports = QueryModel