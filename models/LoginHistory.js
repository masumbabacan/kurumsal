const mongoose = require("mongoose");

const LoginHistorySchema = new mongoose.Schema({
    user: {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    },
    note : {
        type : String
    },
    color : {
        type : String
    }
},{timestamps : true});

module.exports = mongoose.model("LoginHistory",LoginHistorySchema);