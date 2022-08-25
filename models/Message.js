const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    senderName : {
        type : String,
        required : [true,"Lütfen isim giriniz"],
    },
    senderSurname : {
        type : String,
        required : [true,"Lütfen soyisim giriniz"],
    },
    senderMail : {
        type : String,
        required : [true,"Lütfen email giriniz"],
    },
    phoneNumber : {
        type : String,
        required : [true,"Lütfen telefon numaranızı giriniz"],
    },
    content : {
        type : String,
        required : [true,"Lütfen mesaj giriniz"],
    },
    seen : {
        type : Boolean,
        default : false,
    },
},{timestamps : true});

module.exports = mongoose.model("Message",MessageSchema);