const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const crypto = require('crypto');
const { 
    attachCookiesToResponse, 
    createTokenUser, 
    sendVerificationEmail, 
    sendResetPasswordEmail,
    createHash,
    nullControl
} = require("../utils/index");

const register = async (req,res) => {
    const { email, name, surname,username, password } = req.body;
    const emailExist = await User.findOne({email});
    if (emailExist) throw new CustomError.BadRequestError("Email daha önceden alınmış");
    const usernameExist = await User.findOne({username});
    if (usernameExist) throw new CustomError.BadRequestError("kullanıcı adı daha önceden alınmış");
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({name,surname,email,username,password,verificationToken});
    if (!user) throw new CustomError.BadRequestError("Bir hata oluştu");
    const origin = 'http://localhost:3000/api/kurumsal/auth';
    await sendVerificationEmail({
        name : name,
        email : email,
        verificationToken : verificationToken,
        origin : origin,
    });
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı! Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin"});
}

const verifyEmail = async (req,res) => {
    const {verificationToken,email} = req.body;
    const user = await User.findOne({email});
    if (!user || user.verificationToken !== verificationToken) throw new CustomError.UnauthenticatedError("Doğrulama esnasında hata oluştu");
    await User.findOneAndUpdate(
        {_id : user._id},
        {isVerified : true, verified : Date.now(),verificationToken : ''}
    );
    res.status(StatusCodes.OK).json({msg : 'E-posta doğrulandı'});
}


const getLogin = async (req,res) => {
    res.render("public/login");
}

const postLogin = async (req,res) => {
    const {username,password} = req.body;
    console.log(req.body);
    await nullControl([username,password]);
    const user = await User.findOne({username});
    if (!user) throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    if (!user.isVerified) throw new CustomError.UnauthenticatedError("Email adresinizi doğrulayın");
    const tokenUser = createTokenUser(user);
    let refreshToken = '';
    const existingToken = await Token.findOne({ user : user._id });
    if (existingToken) {
        if (!existingToken.isValid) throw new CustomError.UnauthenticatedError("geçersiz kimlik bilgileri");
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({res,user:tokenUser,refreshToken});
        res.status(StatusCodes.OK).json({user:tokenUser, msg: 'Giriş başarılı'});
        console.log(1);
        return;
    }
    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = {refreshToken,ip,userAgent,user:user._id};
    await Token.create(userToken);
    attachCookiesToResponse({res,user:tokenUser,refreshToken});
    console.log(2);
    res.status(StatusCodes.OK).json({user: tokenUser, msg: 'Giriş başarılı'});
}

const logout = async (req,res) => {
    await Token.findOneAndDelete({user:req.user.userId});
    res.cookie("accessToken","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    res.cookie("refreshToken","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg : 'Kullanıcı çıkış yaptı'});
}

const getForgotPassword = async (req,res) => {
    res.render("public/forgotPassword");
}

const postForgotPassword = async (req,res) => {
    const {email} = req.body;
    await nullControl([email]);
    const user = await User.findOne({email});
    if (!user) throw new CustomError.BadRequestError("E-posta hatalı");
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = 'http://localhost:3000/api/kurumsal/auth';
    await sendResetPasswordEmail({
        name:user.name,
        email:user.email,
        token: passwordToken,
        origin : origin,
    });
    const tenMinutes = 1000*60*10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
    res.status(StatusCodes.OK).json({msg : "Şifrenizi sıfırlamak için lütfen e-posta adresinizi kontrol edin"});
}

const resetPassword = async (req,res) => {
    const {token,email,password} = req.body;
    await nullControl([token,email,password]);
    const user = await User.findOne({email});
    if (!user) throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    const currentDate = new Date();
    createHash(token);
    if (user.passwordToken !== token || !user.passwordTokenExpirationDate > currentDate) {
        throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    }
    user.password = password,
    user.passwordToken = null,
    user.passwordTokenExpirationDate = null,
    await user.save();
    res.status(StatusCodes.OK).json({msg : "Şifre sıfırlandı"});
}

module.exports = {
    register,
    getLogin,
    postLogin,
    logout,
    verifyEmail,
    getForgotPassword,
    postForgotPassword,
    resetPassword,
};