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

const getAllServices = async (req,res) => {
    var perpage = (req.query.limit == null) ? 25 : req.query.limit;
    var total = await Service.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    const services = Service.find({}).skip(startFrom).limit(perpage);
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/services/services", { 
        authenticateUser : authenticateUser,
        services: services, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : users.length, 
        msg : 'İşlem başarılı' 
    });
}

module.exports = {
    getAllServices,
}