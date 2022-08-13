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
    var perpage = (req.query.limit == null) ? 25 : req.query.limit;
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
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    if (!user) throw new CustomError.NotFoundError("Kullanıcı Bulunamadı");
    res.status(StatusCodes.OK).render("admin/userDetail",{
        authenticateUser : authenticateUser,
        user : user,
        msg : 'İşlem başarılı'
    })
}

const createUserGet = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.render('admin/createUser',{
        authenticateUser : authenticateUser,
        msg : 'İşlem başarılı'
    });
}

const createUserPost = async (req,res) => {
    const { email, name, surname, username, password, role } = req.body;
    console.log(role);
    const emailExist = await User.findOne({email});
    if (emailExist) throw new CustomError.BadRequestError("Email daha önceden alınmış");
    const usernameExist = await User.findOne({username});
    if (usernameExist) throw new CustomError.BadRequestError("kullanıcı adı daha önceden alınmış");
    const user = await User.create({name,surname,email,username,password,role});
    if (!user) throw new CustomError.BadRequestError("Bir hata oluştu");
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı!"});
}

const showCurrentUser = async (req,res) => {
    const user = await User.findOne({_id : req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).json({data : user});
}

const updateUser = async (req,res) => {
    const {updateUserId,name,surname,role} = req.body;
    const user = await User.findOne({_id : updateUserId});
    if (!user) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    checkPermissions(req.user,user._id);
    user.name = name;
    user.surname = surname;
    user.role = role;
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

const deleteUser = async (req,res) => {
    const user = await User.findOne({_id : req.params.id});
    if (!user) throw new CustomError.BadRequestError("Bir hata oluştu");
    console.log(user);
    if (user.status === false){
        await User.findOneAndUpdate({_id : user._id},{status: true});
    } 
    if (user.status === true){
        await User.findOneAndUpdate({_id : user._id},{status: false});
    }
    await user.save();
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}

module.exports = {
    getAllUsers,
    getUser,
    createUserGet,
    createUserPost,
    updateUser,
    updateUserPassword,
    deleteUser,
}