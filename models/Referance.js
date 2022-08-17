const mongoose = require("mongoose");

const ReferanceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen referans adı giriniz"],
    },
    description : {
        type : String,
        required : [true,"Lütfen referans açıklaması giriniz"],
    },
    imageUrl: String,
    status : {
        type : Boolean,
        default : true,
    },
},{timestamps : true});

module.exports = mongoose.model("Referance",ReferanceSchema);