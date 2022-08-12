const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions, 
    nullControl,
    singleImageUpload, 
    fileDelete
} = require("../utils");

const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';

const getAllUsers = async (req,res) => {
    var perpage = (req.query.limit == null) ? 2 : req.query.limit;
    var total = await User.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    const users = await User.find({}).skip(startFrom).limit(perpage).select(unselectedColumns);
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/users", { 
        authenticateUser : authenticateUser,
        users: users, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : users.length, 
        msg : 'İşlem başarılı' 
    });
}

const getUser = async (req,res) => {
    const user = await User.findOne({_id:req.params.id}).select(unselectedColumns);
    console.log(req.user)
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    if (!user) throw new CustomError.NotFoundError("Kullanıcı Bulunamadı");
    res.status(StatusCodes.OK).render("admin/userDetail",{
        authenticateUser : authenticateUser,
        user : user,
        msg : 'İşlem başarılı'
    })
}

const showCurrentUser = async (req,res) => {
    const user = await User.findOne({_id : req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).json({data : user});
}

const updateUser = async (req,res) => {
    const {updateUserId,name,surname} = req.body;
    const user = await User.findOne({_id : updateUserId});
    if (!user) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    checkPermissions(req.user,user._id);
    user.name = name;
    user.surname = surname;
    await user.save();
    if (req.files) {
        await fileDelete(user.image);
        const image = await singleImageUpload(req);
        user.image = image;
        await user.save();
    }
    res.status(StatusCodes.OK).json({msg : "Güncelleme işlemi başarılı"});
}

const updateUserPassword = async (req,res) => {
    const { oldPassword, newPassword } = req.body;
    await nullControl([oldPassword,newPassword]);
    const user = await User.findOne({_id : req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg : "Şifre başarıyla güncellendi"});
}

module.exports = {
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}