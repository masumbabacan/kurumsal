
const User = require("../models/User");
const Service = require("../models/Service");
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

const getAllServices = async (req,res) => {
    var perpage = (req.query.limit == null) ? 10 : req.query.limit;
    var total = await Service.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    const services = await Service.find({}).skip(startFrom).limit(perpage);
    console.log(services);
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/services/services", { 
        authenticateUser : authenticateUser,
        services: services, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : services.length, 
        msg : 'İşlem başarılı' 
    });
}

const getService = async (req,res) => {
    const service = await Service.findOne({_id:req.params.id});
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    if (!service) throw new CustomError.NotFoundError("Hizmet Bulunamadı");
    res.status(StatusCodes.OK).render("admin/services/serviceDetail",{
        authenticateUser : authenticateUser,
        service : service,
        msg : 'İşlem başarılı'
    })
}

const createServiceGet = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.render('admin/services/createService',{
        authenticateUser : authenticateUser,
        msg : 'İşlem başarılı'
    });
}

const createServicePost = async (req,res) => {
    const { name, description } = req.body;
    const service = await Service.create({name,description});
    if (!service) throw new CustomError.BadRequestError("Bir hata oluştu");
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı!"});
}

const updateService = async (req,res) => {
    const {updateServiceId,name,description,status} = req.body;
    const service = await Service.findOne({_id : updateServiceId});
    if (!service) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    service.name = name;
    service.description = description;
    service.status = status;
    await service.save();
    res.status(StatusCodes.OK).json({msg : "Güncelleme işlemi başarılı"});
}

const deleteService = async (req,res) => {
    const service = await Service.findOneAndDelete({_id : req.params.id});
    if (!service) throw new CustomError.BadRequestError("Bir hata oluştu");
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}

module.exports = {
    getAllServices,
    createServiceGet,
    createServicePost,
    getService,
    updateService,
    deleteService
}