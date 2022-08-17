const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen isim giriniz"],
        minLength : [2,"isim en az 2 karakter olmalıdır"],
        maxLength : [50,"isim en fazla 50 karakter olmalıdır"]
    },
    surname : {
        type : String,
        required : [true,"Lütfen soyisim giriniz"],
        minLength : [2,"soyisim en az 2 karakter olmalıdır"],
        maxLength : [50,"soyisim en fazla 50 karakter olmalıdır"]
    },
    email : {
        type : String,
        unique : true,
        required : [true,"Lütfen email giriniz"],
        validate : {
            validator: validator.isEmail,
            message : "Email doğru bir formatta değil"
        }
    },
    username : {
        type : String,
        unique : true,
        required : [true,"Lütfen kullanıcı adı giriniz"],
        minLength : [5,"kullanıcı adı en az 5 karakter olmalıdır"],
        maxLength : [25,"kullanıcı adı en fazla 25 karakter olmalıdır"]
    },
    password : {
        type : String,
        required : [true,"Lütfen şifre giriniz"],
        minLength : [6,"Şifre en az 6 karakter olmalıdır"],
    },
    image : {
        type : String,
    },
    role : {
        type : String,
        enum : ['admin','companyOfficial'],
        default : "companyOfficial",
    },
    verificationToken : String,
    isVerified : {
        type : Boolean,
        default : true,
    },
    verified : Date,
    passwordToken:{
        type : String,
    },
    status : {
        type : Boolean,
        default : true,
    },
    passwordTokenExpirationDate:{
        type:Date,
    },
},{timestamps : true});

UserSchema.pre('save', async function(){
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword,this.password);
    return isMatch;
}
module.exports = mongoose.model("User",UserSchema);