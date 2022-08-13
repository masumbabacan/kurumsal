const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen servis adı giriniz"],
    },
    description : {
        type : String,
        required : [true,"Lütfen servis açıklaması giriniz"],
    },
    imageUrls: [ String ],
    status : {
        type : Boolean,
        default : true,
    },
},{timestamps : true});

module.exports = mongoose.model("Service",ServiceSchema);