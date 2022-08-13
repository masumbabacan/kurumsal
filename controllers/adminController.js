const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';
const page = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    const userCount = await User.find().count();
    const adminCount = await User.find({role : 'admin'}).count();
    const demoCount = await User.find({role : 'demo'}).count();
    const normalUserCount = await User.find({role : 'user'}).count();
    res.status(200).render("admin/homePage",{
        authenticateUser : authenticateUser,
        totalNumberOfUsers : userCount,
        totalNumberOfAdmin : adminCount,
        totalNumberOfDemo : demoCount,
        totalNumberOfNormalUser : normalUserCount,
    });
}

module.exports = {
    page
}