
const User = require("../models/User");
const Referance = require("../models/Referance");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
    singleImageUpload,
    fileDelete
} = require("../utils");

const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';

const getAllReferances = async (req,res) => {
    var perpage = (req.query.limit == null) ? 10 : req.query.limit;
    var total = await Referance.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    var search = (req.query.search == null) ? '' : req.query.search;
    const referances = await Referance.find({
        $or: [
            {name : {$regex : search, '$options' : 'i'}},
        ]
    }).skip(startFrom).limit(perpage);
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/referances/referances", { 
        authenticateUser : authenticateUser,
        referances: referances, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : referances.length, 
        msg : 'İşlem başarılı' 
    });
}

const getReferance = async (req,res) => {
    const referance = await Referance.findOne({_id:req.params.id});
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    if (!referance) throw new CustomError.NotFoundError("Hizmet Bulunamadı");
    res.status(StatusCodes.OK).render("admin/referances/referanceDetail",{
        authenticateUser : authenticateUser,
        referance : referance,
        msg : 'İşlem başarılı'
    })
}

const createReferanceGet = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.render('admin/referances/createReferance',{
        authenticateUser : authenticateUser,
        msg : 'İşlem başarılı'
    });
}

const createReferancePost = async (req,res) => {
    const { name, description } = req.body;
    const imageUrl = await singleImageUpload(req);
    const referance = await Referance.create({name,description,imageUrl});
    if (!referance) throw new CustomError.BadRequestError("Bir hata oluştu");
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı!"});
}

const updateReferance = async (req,res) => {
    const {updateReferanceId,name,description,status} = req.body;
    const referance = await Service.findOne({_id : updateReferanceId});
    if (!referance) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    referance.name = name;
    referance.description = description;
    referance.status = status;
    await referance.save();
    res.status(StatusCodes.OK).json({msg : "Güncelleme işlemi başarılı"});
}

const updateReferanceImages = async (req,res) => {
    const {updateReferanceId} = req.body;
    const referance = await Referance.findOne({_id : updateReferanceId});
    if (!referance) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    const imageUrl = await singleImageUpload(req);
    await fileDelete(referance.imageUrl);
    referance.imageUrl = imageUrl;
    await referance.save();
    res.status(StatusCodes.OK).json({msg : "Güncelleme işlemi başarılı"});
}

const deleteReferance = async (req,res) => {
    const referance = await Referance.findOneAndDelete({_id : req.params.id});
    if (!referance) throw new CustomError.BadRequestError("Bir hata oluştu");
    await fileDelete(referance.imageUrl);
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}

const deleteReferanceImage = async (req,res) => {
    const referance = await Referance.findOne({_id : req.query.referanceId});
    if (!referance) throw new CustomError.BadRequestError("Bir hata oluştu");
    await fileDelete(referance.imageUrl);
    referance.imageUrl = null;
    await referance.save();
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}

module.exports = {
    getAllReferances,
    createReferanceGet,
    createReferancePost,
    getReferance,
    updateReferance,
    deleteReferance,
    deleteReferanceImage,
    updateReferanceImages
}