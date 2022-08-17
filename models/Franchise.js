const mongoose = require("mongoose");

const FranchiseSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen bayi adı giriniz"],
    },
    description : {
        type : String,
        required : [true,"Lütfen bayi açıklaması giriniz"],
    },
    imageUrl: String,
    status : {
        type : Boolean,
        default : true,
    },
},{timestamps : true});

module.exports = mongoose.model("Franchise",FranchiseSchema);