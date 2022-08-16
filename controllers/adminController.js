const User = require("../models/User");
const Service = require("../models/Service");
const LoginHistory = require("../models/LoginHistory");
const { StatusCodes } = require("http-status-codes");
const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';

const page = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    const userCount = await User.find().count();
    const adminCount = await User.find({role : 'admin'}).count();
    const demoCount = await User.find({role : 'demo'}).count();
    const normalUserCount = await User.find({role : 'user'}).count();
    const serviceCount = await Service.find({}).count();
    res.status(200).render("admin/homePage",{
        authenticateUser : authenticateUser,
        totalNumberOfUsers : userCount,
        totalNumberOfAdmin : adminCount,
        totalNumberOfDemo : demoCount,
        totalNumberOfNormalUser : normalUserCount,
        totalNumberOfService : serviceCount,
    });
}

const loginHistories = async (req,res) => {
    var perpage = (req.query.limit == null) ? 5 : req.query.limit;
    var total = await LoginHistory.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    const loginHistories = await LoginHistory.find({}).skip(startFrom).limit(perpage).sort({createdAt : -1}).populate({path : 'user', select : unselectedColumns});
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/loginHistories", { 
        authenticateUser : authenticateUser,
        loginHistories: loginHistories, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : loginHistories.length, 
        msg : 'İşlem başarılı' 
    });
}

const allHistoryDelete = async (req,res) => {
    await LoginHistory.deleteMany();
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}

module.exports = {
    page,
    loginHistories,
    allHistoryDelete,
}