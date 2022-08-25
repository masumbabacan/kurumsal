
const User = require("../models/User");
const Franchise = require("../models/Franchise");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
    singleImageUpload,
    fileDelete
} = require("../utils");

const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';

const getAllFranchises = async (req,res) => {
    var perpage = (req.query.limit == null) ? 10 : req.query.limit;
    var total = await Franchise.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    var search = (req.query.search == null) ? '' : req.query.search;
    const franchises = await Franchise.find({
        $or: [
            {name : {$regex : search, '$options' : 'i'}},
        ]
    }).skip(startFrom).limit(perpage);
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/franchises/franchises", { 
        authenticateUser : authenticateUser,
        franchises: franchises, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : franchises.length, 
        msg : 'İşlem başarılı' 
    });
}

const getFranchise = async (req,res) => {
    const franchise = await Franchise.findOne({_id:req.params.id});
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    if (!franchise) throw new CustomError.NotFoundError("Hizmet Bulunamadı");
    res.status(StatusCodes.OK).render("admin/franchises/franchiseDetail",{
        authenticateUser : authenticateUser,
        franchise : franchise,
        msg : 'İşlem başarılı'
    })
}

const createFranchiseGet = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.render('admin/franchises/createFranchise',{
        authenticateUser : authenticateUser,
        msg : 'İşlem başarılı'
    });
}

const createFranchisePost = async (req,res) => {
    const { name, description } = req.body;
    const imageUrl = await singleImageUpload(req);
    const franchise = await Franchise.create({name,description,imageUrl});
    if (!franchise) throw new CustomError.BadRequestError("Bir hata oluştu");
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı!"});
}

const updateFranchise = async (req,res) => {
    const {updateFranchiseId,name,description,status} = req.body;
    const franchise = await Franchise.findOne({_id : updateFranchiseId});
    if (!franchise) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    franchise.name = name;
    franchise.description = description;
    franchise.status = status;
    await franchise.save();
    res.status(StatusCodes.OK).json({msg : "Güncelleme işlemi başarılı"});
}

const updateFranchiseImages = async (req,res) => {
    const {updateFranchiseId} = req.body;
    const franchise = await Franchise.findOne({_id : updateFranchiseId});
    if (!franchise) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    const imageUrl = await singleImageUpload(req);
    await fileDelete(franchise.imageUrl);
    franchise.imageUrl = imageUrl;
    await franchise.save();
    res.status(StatusCodes.OK).json({msg : "Güncelleme işlemi başarılı"});
}

const deleteFranchise = async (req,res) => {
    const franchise = await Franchise.findOneAndDelete({_id : req.params.id});
    if (!franchise) throw new CustomError.BadRequestError("Bir hata oluştu");
    await fileDelete(franchise.imageUrl);
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}

const deleteFranchiseImage = async (req,res) => {
    const franchise = await Franchise.findOne({_id : req.query.franchiseId});
    if (!franchise) throw new CustomError.BadRequestError("Bir hata oluştu");
    await fileDelete(franchise.imageUrl);
    franchise.imageUrl = null;
    await franchise.save();
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}


module.exports = {
    getAllFranchises,
    createFranchiseGet,
    createFranchisePost,
    getFranchise,
    updateFranchise,
    deleteFranchise,
    deleteFranchiseImage,
    updateFranchiseImages
}